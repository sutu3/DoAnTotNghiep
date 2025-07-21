package com.example.authenservice.Modal;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends BaseEntity {
    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    String idUser;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên người dùng'",nullable = false)
    String username;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'mật khẩu người dùng'",nullable = false)
    String password;
    @Column(columnDefinition = "VARCHAR(255)  COMMENT 'email người dùng'",nullable = false,unique = true)
    String email;
    @ManyToMany
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "users_id_user", referencedColumnName = "idUser"),
            inverseJoinColumns = @JoinColumn(name = "role_name", referencedColumnName = "roleName")
    )
    Set<Role> roles;

}
