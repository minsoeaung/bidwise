package com.bidwise.comments.util;

import com.bidwise.comments.model.UserProfile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;

public class UserProfileUtils {
    public static UserProfile getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        OAuth2AuthenticatedPrincipal principal = (OAuth2AuthenticatedPrincipal) authentication.getPrincipal();

        if (principal.getAttribute("user_id") != null) {
            UserProfile userProfile = new UserProfile();
            userProfile.setId(Integer.parseInt(principal.getAttribute("user_id")));
            userProfile.setUserName(principal.getAttribute("username"));
            userProfile.setEmail(principal.getAttribute("email"));
            return userProfile;
        } else {
            return null;
        }
    }
}
