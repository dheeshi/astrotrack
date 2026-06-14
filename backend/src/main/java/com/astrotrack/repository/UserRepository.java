package com.astrotrack.repository;

import com.astrotrack.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Adds a custom query channel to search users by username string automatically
    Optional<User> findByUsername(String username);
}