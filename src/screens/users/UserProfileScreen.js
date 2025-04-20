import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Divider, Avatar, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../constants';
import LoadingScreen from '../common/LoadingScreen';

// This would typically come from an API service
const getUserById = async (userId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user: {
            _id: userId || '1',
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '1234567890',
            role: 'admin',
            active: true,
            createdAt: '2023-01-01T00:00:00.000Z',
            lastLogin: '2023-06-15T12:30:00.000Z',
          }
        }
      });
    }, 1000);
  });
};

const UserProfileScreen = ({ navigation, route }) => {
  const { user: currentUser } = useAuth();
  const userId = route.params?.userId || currentUser?._id;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser();
  }, []);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserById(userId);
      
      if (response && response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return styles.adminBadge;
      case 'manager':
        return styles.managerBadge;
      case 'staff':
        return styles.staffBadge;
      default:
        return styles.staffBadge;
    }
  };
  
  if (loading && !refreshing) {
    return <LoadingScreen />;
  }
  
  if (error || !user) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title="User Profile" />
        </Appbar.Header>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error || 'User not found'}</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="User Profile" />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={getInitials(user.name)}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{user.name}</Title>
              <View style={[styles.roleBadge, getRoleBadgeStyle(user.role)]}>
                <Text style={styles.roleText}>{user.role}</Text>
              </View>
              <Paragraph style={styles.profileEmail}>{user.email}</Paragraph>
            </View>
          </Card.Content>
          
          {userId === currentUser?._id && (
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('EditUser', { userId: user._id })}
                style={styles.editButton}
                icon="account-edit"
              >
                Edit Profile
              </Button>
            </Card.Actions>
          )}
        </Card>
        
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Contact Information</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Email"
              description={user.email}
              left={props => <List.Icon {...props} icon="email" />}
            />
            
            <List.Item
              title="Phone"
              description={user.phoneNumber}
              left={props => <List.Icon {...props} icon="phone" />}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Account Information</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Role"
              description={user.role}
              left={props => <List.Icon {...props} icon="shield-account" />}
            />
            
            <List.Item
              title="Status"
              description={user.active ? 'Active' : 'Inactive'}
              left={props => <List.Icon {...props} icon="account-check" />}
            />
            
            <List.Item
              title="Created On"
              description={new Date(user.createdAt).toLocaleDateString()}
              left={props => <List.Icon {...props} icon="calendar" />}
            />
            
            <List.Item
              title="Last Login"
              description={new Date(user.lastLogin).toLocaleString()}
              left={props => <List.Icon {...props} icon="login" />}
            />
          </Card.Content>
        </Card>
        
        {userId === currentUser?._id && (
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Security</Title>
              <Divider style={styles.divider} />
              
              <Button
                mode="outlined"
                onPress={() => {
                  Alert.alert('Feature Coming Soon', 'This feature will be available in a future update.');
                }}
                style={styles.securityButton}
                icon="lock"
              >
                Change Password
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SIZES.medium,
    paddingBottom: SIZES.extraLarge,
  },
  profileCard: {
    marginBottom: SIZES.medium,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: COLORS.primary,
    marginRight: SIZES.medium,
  },
  avatarLabel: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base / 2,
    marginVertical: SIZES.base / 2,
  },
  adminBadge: {
    backgroundColor: '#E3F2FD',
  },
  managerBadge: {
    backgroundColor: '#E8F5E9',
  },
  staffBadge: {
    backgroundColor: '#FFF8E1',
  },
  roleText: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.medium,
    paddingBottom: SIZES.medium,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  detailsCard: {
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    marginVertical: SIZES.base,
  },
  securityButton: {
    marginTop: SIZES.base,
    borderColor: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.extraLarge,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginVertical: SIZES.medium,
  },
  backButton: {
    backgroundColor: COLORS.primary,
  },
});

export default UserProfileScreen;
