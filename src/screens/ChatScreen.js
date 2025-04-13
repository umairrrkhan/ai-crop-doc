// ChatScreen.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createChatSession, addMessageToSession, getSessionMessages } from '../services/chatService';
import { generateResponse } from '../services/ai';

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  const scrollViewRef = useRef(null);
  // Calculate estimated item height for virtualized list
  const estimatedItemHeight = 80;
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      backHandler.remove();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadChatSession = async () => {
      setIsLoading(true);
      try {
        if (route.params?.chatId) {
          setCurrentChatId(route.params.chatId);
          const messagesData = await getSessionMessages(route.params.chatId);
          if (Array.isArray(messagesData)) {
            setMessages(messagesData);
          } else {
            console.error('getSessionMessages did not return an array:', messagesData);
            setMessages([]);
          }
        } else if (route.params?.createNewSession) {
          // Clear all states for new chat session
          setMessages([]);
          setCurrentChatId(null);
          setChatTitle('');
          setInputText('');
        }
      } catch (error) {
        console.error('Error loading chat session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadChatSession();
  }, [route.params?.chatId, route.params?.createNewSession]);

  // Simplified scroll to end function with cleanup
  const scrollToEnd = useCallback(() => {
    if (scrollViewRef.current) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, []);

  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: 'user',
      status: 'sent',
    };

    setInputText('');
    setIsLoading(true); // Set loading *before* adding the user message
    try {
      let chatId = currentChatId;
      if (!chatId) {
        const newChatTitle = trimmedText.slice(0, 50) + (trimmedText.length > 50 ? '...' : '');
        chatId = await createChatSession(newChatTitle);
        setCurrentChatId(chatId);
        setChatTitle(newChatTitle);
      }

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      await addMessageToSession(chatId, userMessage);

      let aiResponse = await generateResponse(trimmedText);
      if (!aiResponse) {
        aiResponse = "I'm sorry, I didn't understand your request. Could you rephrase it?";
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        status: 'delivered',
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      await addMessageToSession(chatId, aiMessage);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        sender: 'ai',
        status: 'error',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToEnd();
    }
  };

  const handleTextInputChange = (text) => {
    setInputText(text);
  };

  const MessageItem = React.memo(({ message }) => (
    <View style={styles.messageWrapper}>
      <View style={[styles.messageContainer, message.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
        {message.sender === 'ai' && (
          <View style={styles.aiAvatar}>
            <Ionicons name="logo-github" size={24} color="#27ae60" />
          </View>
        )}
        <View style={[styles.messageContent, message.sender === 'user' ? styles.userMessageContent : styles.aiMessageContent]}>
          <Text style={[styles.messageText, message.sender === 'ai' && styles.aiMessageText]} numberOfLines={0}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  ), (prevProps, nextProps) => prevProps.message === nextProps.message);

  const renderMessage = useCallback(({ item: message }) => <MessageItem message={message} />, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: estimatedItemHeight,
      offset: estimatedItemHeight * index,
      index,
    }),
    []
  );

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToEnd();
    }
  }, [messages, isLoading, scrollToEnd]);


  return (
    <>
      <LinearGradient colors={['#f5fcf7', '#e8f7ed']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setMessages([]);
              setCurrentChatId(null);
              setInputText('');
              setChatTitle('');
              setIsLoading(false);
              setIsTyping(false);
            }}
            style={styles.menuButton}
          >
            <Ionicons name="add-circle-outline" size={24} color="#27ae60" />
          </TouchableOpacity>
          {chatTitle && (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chatTitle}
            </Text>
          )}
          <View style={styles.headerAction} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.content}>
          <FlatList
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            initialNumToRender={100}
            maxToRenderPerBatch={50}
            updateCellsBatchingPeriod={50}
            windowSize={10}
            removeClippedSubviews={false}
            getItemLayout={getItemLayout}
            onContentSizeChange={() => scrollToEnd()}
            onLayout={() => scrollToEnd()}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 0
            }}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#27ae60" />
                  <Text style={styles.loadingText}>Processing...</Text>
                </View>
              ) : null
            }
          />

          <View style={[styles.inputContainer]}>
            <View style={[styles.inputWrapper]}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={handleTextInputChange}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.attachButton}>
                <Ionicons name="attach" size={24} color="#27ae60" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const styles = StyleSheet.create({
 container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f7ed',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerAction: {
    width: 24,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  dateHeader: {  // Keep the styles, but they won't be used.
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: { // Keep the styles, but they won't be used.
    fontSize: 14,
    color: '#666',
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: SCREEN_WIDTH * 0.8,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  aiAvatar: {
    marginRight: 8,
  },
  messageContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    elevation: 2,
  },
  userMessageContent: {
    backgroundColor: '#DCF8C6',
  },
  aiMessageContent: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  aiMessageText: {
    color: '#333',
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8f7ed',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 150,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
  },
  sendButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#27ae60',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default ChatScreen;