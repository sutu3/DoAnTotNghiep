package com.example.userservice.Repo.Specification;

import com.example.userservice.Model.TaskType;
import com.example.userservice.Model.Tasks;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {

    public static Specification<Tasks> hasTaskTypeNameLike(String keyword) {
        return (root, query, criteriaBuilder) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return criteriaBuilder.conjunction(); // không filter gì nếu không có từ khóa
            }

            Join<Tasks, TaskType> taskTypeJoin = root.join("taskType", JoinType.INNER);
            return criteriaBuilder.like(
                    criteriaBuilder.lower(taskTypeJoin.get("taskName")),
                    "%" + keyword.toLowerCase() + "%"
            );
        };
    }
    public static Specification<Tasks> hasWarehouses(String warehouses) {
        return (root, query, criteriaBuilder) ->
                warehouses == null ? null : criteriaBuilder.equal(root.get("warehouses"), warehouses);
    }
    public static Specification<Tasks> hasStatus(String status) {
        return (root, query, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }


}
