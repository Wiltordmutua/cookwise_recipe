import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = useQuery(api.users.getNotifications);
  const markAsRead = useMutation(api.users.markNotificationRead);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead({ notificationId: notificationId });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'text.primary',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        </Box>

        {notifications === undefined ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  button
                  onClick={() => handleMarkAsRead(notification._id)}
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(108, 117, 95, 0.08)',
                    '&:hover': {
                      backgroundColor: notification.isRead
                        ? 'rgba(108, 117, 95, 0.04)'
                        : 'rgba(108, 117, 95, 0.12)',
                    },
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(notification._creationTime).toLocaleDateString()}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: notification.isRead ? 400 : 600,
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                    }}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}
