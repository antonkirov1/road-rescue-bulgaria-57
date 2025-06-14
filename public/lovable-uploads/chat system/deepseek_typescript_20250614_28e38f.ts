// ChatSystem.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from './supabaseClient';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'employee';
  status: 'available' | 'away';
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

const ChatSystem = ({ userId, userRole }: { userId: string; userRole: 'admin' | 'employee' }) => {
  const [activeTab, setActiveTab] = useState<'group' | 'personal'>('group');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<'available' | 'away'>('available');

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
    fetchStatus();
    setupRealtime();
  }, []);

  // Load messages when tab or user changes
  useEffect(() => {
    if (activeTab === 'group') {
      loadGroupMessages();
    } else if (selectedUser) {
      loadPersonalMessages();
    }
  }, [activeTab, selectedUser]);

  const fetchUsers = async () => {
    const { data: employees } = await supabase.from('employee_accounts').select('id, name, status');
    const { data: admins } = await supabase.from('admin_accounts').select('id, name, status');
    
    const allUsers = [
      ...(employees?.map(e => ({ ...e, role: 'employee' })) || [],
      ...(admins?.map(a => ({ ...a, role: 'admin' })) || [])
    ];
    
    setUsers(allUsers.filter(u => u.id !== userId));
  };

  const fetchStatus = async () => {
    const table = userRole === 'admin' ? 'admin_accounts' : 'employee_accounts';
    const { data } = await supabase
      .from(table)
      .select('status')
      .eq('id', userId)
      .single();
    
    if (data) setStatus(data.status);
  };

  const updateStatus = async (newStatus: 'available' | 'away') => {
    const table = userRole === 'admin' ? 'admin_accounts' : 'employee_accounts';
    await supabase
      .from(table)
      .update({ status: newStatus })
      .eq('id', userId);
    
    setStatus(newStatus);
  };

  const loadGroupMessages = async () => {
    const { data } = await supabase
      .from('group_chat_history')
      .select('id, sender_id, message, created_at')
      .order('created_at', { ascending: true });
    
    if (data) {
      const messagesWithNames = await Promise.all(data.map(async msg => ({
        ...msg,
        sender_name: await getSenderName(msg.sender_id)
      })));
      setMessages(messagesWithNames);
    }
  };

  const loadPersonalMessages = async () => {
    if (!selectedUser) return;
    
    const table = userRole === 'admin' ? 'admin_chat_history' : 'employee_chat_history';
    const { data } = await supabase
      .from(table)
      .select('id, sender_id, message, created_at')
      .eq('user_id', userId)
      .eq('recipient_id', selectedUser)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const getSenderName = async (senderId: string) => {
    const user = users.find(u => u.id === senderId);
    return user ? user.name : 'Unknown';
  };

  const setupRealtime = () => {
    // Group chat subscription
    supabase
      .channel('group-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'group_chat_history'
      }, handleNewGroupMessage)
      .subscribe();

    // Personal chat subscription
    const personalTable = userRole === 'admin' ? 'admin_chat_history' : 'employee_chat_history';
    supabase
      .channel('personal-chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: personalTable
      }, handleNewPersonalMessage)
      .subscribe();
  };

  const handleNewGroupMessage = (payload: any) => {
    if (status === 'away') {
      setUnreadCount(prev => prev + 1);
    } else {
      getSenderName(payload.new.sender_id).then(sender_name => {
        setMessages(prev => [...prev, { ...payload.new, sender_name }]);
      });
    }
  };

  const handleNewPersonalMessage = (payload: any) => {
    if (payload.new.recipient_id === userId) {
      if (status === 'away' || activeTab !== 'personal') {
        setUnreadCount(prev => prev + 1);
      } else {
        setMessages(prev => [...prev, payload.new]);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (activeTab === 'group') {
      // Send to group chat
      await supabase
        .from('group_chat_history')
        .insert([{
          sender_id: userId,
          sender_role: userRole,
          message: newMessage
        }]);
    } else if (selectedUser) {
      // Send personal message
      const table = userRole === 'admin' ? 'admin_chat_history' : 'employee_chat_history';
      await supabase
        .from(table)
        .insert([{
          sender_id: userId,
          recipient_id: selectedUser,
          message: newMessage,
          is_group: false
        }]);
      
      // Add to recipient's history
      const recipientTable = users.find(u => u.id === selectedUser)?.role === 'admin' 
        ? 'admin_chat_history' 
        : 'employee_chat_history';
      
      await supabase
        .from(recipientTable)
        .insert([{
          sender_id: userId,
          recipient_id: selectedUser,
          message: newMessage,
          is_group: false
        }]);
    }

    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={28} color="#4A90E2" />
        <TouchableOpacity onPress={() => setUnreadCount(0)}>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications" size={28} color="#4A90E2" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Status Selector */}
      <View style={styles.statusContainer}>
        <Text>Status:</Text>
        <TouchableOpacity
          style={[styles.statusButton, status === 'available' && styles.activeStatus]}
          onPress={() => updateStatus('available')}>
          <Text>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusButton, status === 'away' && styles.activeStatus]}
          onPress={() => updateStatus('away')}>
          <Text>Away</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'group' && styles.activeTab]}
          onPress={() => setActiveTab('group')}>
          <Text>Group Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
          onPress={() => setActiveTab('personal')}>
          <Text>Personal</Text>
        </TouchableOpacity>
      </View>

      {/* User Selector (Personal Chat) */}
      {activeTab === 'personal' && (
        <FlatList
          horizontal
          data={users}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userItem, selectedUser === item.id && styles.selectedUser]}
              onPress={() => setSelectedUser(item.id)}>
              <Text>{item.name}</Text>
              <View style={[styles.statusIndicator, item.status === 'available' ? styles.available : styles.away]} />
            </TouchableOpacity>
          )}
          style={styles.userList}
        />
      )}

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer, 
            item.sender_id === userId && styles.ownMessage
          ]}>
            <Text style={styles.senderName}>
              {item.sender_name || 'You'}
            </Text>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.created_at).toLocaleTimeString()}
            </Text>
          </View>
        )}
        style={styles.chatContainer}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  notificationIcon: { position: 'relative' },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: { color: 'white', fontSize: 12 },
  statusContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  statusButton: { 
    padding: 8, 
    marginLeft: 8, 
    borderWidth: 1, 
    borderRadius: 4 
  },
  activeStatus: { backgroundColor: '#e0f0ff' },
  tabContainer: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    marginBottom: 8 
  },
  tab: { 
    padding: 12, 
    borderBottomWidth: 2, 
    borderBottomColor: 'transparent' 
  },
  activeTab: { borderBottomColor: '#4A90E2' },
  userList: { maxHeight: 60, marginBottom: 8 },
  userItem: { 
    padding: 8, 
    marginRight: 8, 
    borderWidth: 1, 
    borderRadius: 4 
  },
  selectedUser: { backgroundColor: '#e0f0ff' },
  statusIndicator: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginTop: 4 
  },
  available: { backgroundColor: 'green' },
  away: { backgroundColor: 'orange' },
  chatContainer: { flex: 1, marginBottom: 8 },
  messageContainer: { 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#f0f0f0', 
    marginBottom: 8, 
    maxWidth: '80%' 
  },
  ownMessage: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#dcf8c6' 
  },
  senderName: { 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  messageText: { fontSize: 16 },
  timestamp: { 
    fontSize: 12, 
    color: '#666', 
    alignSelf: 'flex-end' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderRadius: 20, 
    padding: 12, 
    marginRight: 8 
  },
  sendButton: { 
    backgroundColor: '#4A90E2', 
    borderRadius: 20, 
    padding: 12 
  }
});

export default ChatSystem;