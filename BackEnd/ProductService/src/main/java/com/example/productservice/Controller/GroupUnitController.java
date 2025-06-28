package com.example.productservice.Controller;

import com.example.productservice.Dto.Requests.GroupUnitRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponse;
import com.example.productservice.Form.GroupUnitForm;
import com.example.productservice.Service.GroupUnitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groupUnits")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Group Unit API", description = "Quản lý nhóm đơn vị sản phẩm")
public class GroupUnitController {
    private final GroupUnitService groupUnitService;

    @GetMapping
    public ApiResponse<Page<GroupUnitResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<GroupUnitResponse>>builder()
                .Result(groupUnitService.getAll(pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/groupUnitId/{groupUnitId}")
    public ApiResponse<GroupUnitResponse> getByGroupUnitId(
            @PathVariable String groupUnitId
    ){
        return ApiResponse.<GroupUnitResponse>builder()
                .Result(groupUnitService.getByIdResponse(groupUnitId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<GroupUnitResponse> createGroupUnit(
            @RequestBody GroupUnitRequest request
            ){
        return ApiResponse.<GroupUnitResponse>builder()
                .Result(groupUnitService.createGroupUnit(request))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PutMapping("/search/categoryId/{categoryId}")
    public ApiResponse<GroupUnitResponse> updateGroupUnit(
            @RequestBody GroupUnitForm form,
            @PathVariable String groupUnitId
    ){
        return ApiResponse.<GroupUnitResponse>builder()
                .Result(groupUnitService.updateGroupUnit(form,groupUnitId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @DeleteMapping("/{groupUnitId}")
    public ApiResponse<String> delete(
            @PathVariable String groupUnitId
    ){
        groupUnitService.deleteGroupUnit(groupUnitId);
        return ApiResponse.<String>builder()
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
