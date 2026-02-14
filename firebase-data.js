// ========== CLUB FUNCTIONS ==========

// Get all clubs
async function getClubs() {
    try {
        const snapshot = await database.ref('clubs').once('value');
        const clubs = snapshot.val();
        return clubs ? Object.values(clubs) : [];
    } catch (error) {
        console.error("Error getting clubs:", error);
        return [];
    }
}

// Get club by name
async function getClubByName(name) {
    try {
        const snapshot = await database.ref('clubs').once('value');
        const clubs = snapshot.val();
        if (!clubs) return null;
        
        for (let key in clubs) {
            if (clubs[key].name === name) {
                return { ...clubs[key], key };
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting club by name:", error);
        return null;
    }
}

// Get club by ID
async function getClubById(id) {
    try {
        const snapshot = await database.ref('clubs').once('value');
        const clubs = snapshot.val();
        if (!clubs) return null;
        
        for (let key in clubs) {
            if (clubs[key].id == id) {
                return { ...clubs[key], key };
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting club by ID:", error);
        return null;
    }
}

// Update club
async function updateClub(clubId, updates) {
    try {
        const club = await getClubById(clubId);
        if (club && club.key) {
            await database.ref(`clubs/${club.key}`).update(updates);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error updating club:", error);
        return false;
    }
}

// Add join request
async function addJoinRequest(clubId, request) {
    try {
        const club = await getClubById(clubId);
        if (club && club.key) {
            const joinRequests = club.joinRequests || [];
            joinRequests.push(request);
            await database.ref(`clubs/${club.key}`).update({ joinRequests });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error adding join request:", error);
        return false;
    }
}

// Add question
async function addQuestion(clubId, question) {
    try {
        const club = await getClubById(clubId);
        if (club && club.key) {
            const questions = club.questions || [];
            questions.push(question);
            await database.ref(`clubs/${club.key}`).update({ questions });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error adding question:", error);
        return false;
    }
}

// ========== USER FUNCTIONS ==========

// Get user by email
async function getUserByEmail(email) {
    try {
        const snapshot = await database.ref('users').once('value');
        const users = snapshot.val();
        if (!users) return null;
        
        for (let key in users) {
            if (users[key].email === email) {
                return { ...users[key], key };
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
    }
}

// Create user
async function createUser(userData) {
    try {
        const newUserRef = database.ref('users').push();
        await newUserRef.set({
            ...userData,
            createdAt: new Date().toLocaleDateString()
        });
        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        return false;
    }
}

// ========== NOTIFICATION FUNCTIONS ==========

// Add notification
async function addNotification(notification) {
    try {
        const newNotifRef = database.ref('notifications').push();
        await newNotifRef.set({
            ...notification,
            read: false,
            date: new Date().toLocaleDateString()
        });
        return true;
    } catch (error) {
        console.error("Error adding notification:", error);
        return false;
    }
}

// Get user notifications
async function getUserNotifications(email) {
    try {
        const snapshot = await database.ref('notifications').once('value');
        const notifs = snapshot.val();
        if (!notifs) return [];
        
        const userNotifs = [];
        for (let key in notifs) {
            if (notifs[key].to === email) {
                userNotifs.push({ id: key, ...notifs[key] });
            }
        }
        return userNotifs.sort((a, b) => b.date.localeCompare(a.date));
    } catch (error) {
        console.error("Error getting notifications:", error);
        return [];
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
    try {
        await database.ref(`notifications/${notificationId}`).update({ read: true });
        return true;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
}

// Get unread count
async function getUnreadCount(email) {
    try {
        const notifications = await getUserNotifications(email);
        return notifications.filter(n => !n.read).length;
    } catch (error) {
        console.error("Error getting unread count:", error);
        return 0;
    }
}

// Delete notification
async function deleteNotification(notificationId) {
    try {
        await database.ref(`notifications/${notificationId}`).remove();
        return true;
    } catch (error) {
        console.error("Error deleting notification:", error);
        return false;
    }
}

// Mark all notifications as read for a user
async function markAllNotificationsAsRead(email) {
    try {
        const snapshot = await database.ref('notifications').once('value');
        const notifs = snapshot.val();
        
        if (!notifs) return true;
        
        for (let key in notifs) {
            if (notifs[key].to === email && !notifs[key].read) {
                await database.ref(`notifications/${key}`).update({ read: true });
            }
        }
        return true;
    } catch (error) {
        console.error("Error marking all as read:", error);
        return false;
    }
}

// ========== ADMIN FUNCTIONS ==========

// Get clubs where user is admin
async function getClubsByAdmin(email) {
    try {
        const snapshot = await database.ref('clubs').once('value');
        const clubs = snapshot.val();
        if (!clubs) return [];
        
        const adminClubs = [];
        for (let key in clubs) {
            if (clubs[key].clubAdmins && clubs[key].clubAdmins.includes(email)) {
                adminClubs.push({ ...clubs[key], key });
            }
        }
        return adminClubs;
    } catch (error) {
        console.error("Error getting clubs by admin:", error);
        return [];
    }
}

// Check if user is admin of any club
async function isUserClubAdmin(email) {
    try {
        const clubs = await getClubsByAdmin(email);
        return clubs.length > 0;
    } catch (error) {
        console.error("Error checking if user is admin:", error);
        return false;
    }
}

// ========== HELPER FUNCTIONS ==========

// Get current user from localStorage
function getCurrentUser() {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

// Get all users (for super admin)
async function getAllUsers() {
    try {
        const snapshot = await database.ref('users').once('value');
        const users = snapshot.val();
        return users ? Object.values(users) : [];
    } catch (error) {
        console.error("Error getting all users:", error);
        return [];
    }
}

// Update user role
async function updateUserRole(email, newRole) {
    try {
        const snapshot = await database.ref('users').once('value');
        const users = snapshot.val();
        
        for (let key in users) {
            if (users[key].email === email) {
                await database.ref(`users/${key}`).update({ role: newRole });
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error updating user role:", error);
        return false;
    }
}