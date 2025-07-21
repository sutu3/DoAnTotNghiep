package com.example.userservice.Model;

import com.example.userservice.Enum.StatusEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 2, max = 50, message = "USERNAME_SIZE")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ được chứa chữ cái, số và dấu gạch dưới")
    @Column(columnDefinition = "VARCHAR(50) COMMENT 'tên của user'", nullable = false)
    String userName;

    @NotBlank(message = "FULLNAME_REQUIRED")
    @Size(min = 2, max = 100, message = "Tên đầy đủ phải từ 2-100 ký tự")
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'tên đầy đủ của user'")
    String fullName;

    @NotBlank(message = "EMAIL_REQUIRED")
    @Email(message = "Email không hợp lệ")
    @Size(max = 255, message = "Email không được quá 255 ký tự")
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'email của user'", nullable = false, unique = true)
    String email;
    @Size(max = 500, message = "URL ảnh không được quá 500 ký tự")
    @Pattern(regexp = "^(https?://).*\\\\.(jpg|jpeg|png|gif|webp)$", message = "URL ảnh không hợp lệ",
            flags = Pattern.Flag.CASE_INSENSITIVE)
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'url của user'")
    String urlImage;


    @NotBlank(message = "WAREHOUSE_REQUIRED")
    @Size(min = 36, max = 36, message = "Warehouse ID phải là UUID hợp lệ")
    @Column(columnDefinition = "VARCHAR(36) COMMENT 'mã id của warehouse của nhân viên'")
    String warehouses;

    @NotNull(message = "STATUS_REQUIRED")
    @Enumerated(EnumType.STRING)
    StatusEnum status;
    @Column(columnDefinition = "VARCHAR(255) COMMENT 'số điện thoại của user'", nullable = false,unique = true)
    String phoneNumber;
    @OneToMany(mappedBy="user")
    List<TaskUser> taskUsers;

}
