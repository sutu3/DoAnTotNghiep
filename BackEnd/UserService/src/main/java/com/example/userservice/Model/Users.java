package com.example.userservice.Model;

import com.example.userservice.Enum.StatusEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@SuperBuilder  // Thay @Builder bằng @SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Users extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên của user'", nullable = false)
    String userName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên đầy đủ của user'")
    String fullName;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'email của user'", nullable = false,unique = true)
    String email;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'url của user'")
    String urlImage;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'số điện thoại của user'", nullable = false,unique = true)
    String phoneNumber;
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse của nhân viên'")
    String warehouses;
    @Enumerated(EnumType.STRING)
    StatusEnum status;
    @OneToMany(mappedBy="user")
    List<TaskUser> taskUsers;
}
