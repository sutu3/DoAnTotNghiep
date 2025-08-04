package com.example.userservice.Dto.Responses.TaskUser;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StatsResponse {
    Integer totalTasks;
    Integer totalTasksCompleted;
    Integer totalTasksInProgress;
    Integer totalTasksHightLevel;
    Integer totalTasksPending;

}
