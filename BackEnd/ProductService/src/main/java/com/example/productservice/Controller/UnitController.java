package com.example.productservice.Controller;

import com.example.productservice.Dto.Requests.UnitRequest;
import com.example.productservice.Dto.Responses.ApiResponse;
import com.example.productservice.Dto.Responses.GroupUnit.GroupUnitResponse;
import com.example.productservice.Dto.Responses.Unit.UnitNameResponse;
import com.example.productservice.Dto.Responses.Unit.UnitResponse;
import com.example.productservice.Form.UnitForm;
import com.example.productservice.Service.UnitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
@Tag(name = "Unit API", description = "Quản lý đơn vị sản phẩm")
public class UnitController {
    private final UnitService unitService;

    @GetMapping
    public ApiResponse<Page<UnitResponse>> getAll(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<UnitResponse>>builder()
                .Result(unitService.getAll(pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/UnitNames")
    public ApiResponse<List<UnitNameResponse>> getAllByGroupUnitName(){
        return ApiResponse.<List<UnitNameResponse>>builder()
                .Result(unitService.getAllUnitName())
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @GetMapping("/search/groupUnitName/{groupUnitName}")
    public ApiResponse<Page<UnitResponse>> getAllByGroupUnitName(
            @RequestParam("pageNumber") int page,
            @RequestParam("pageSize") int size,
            @PathVariable String groupUnitName
    ){
        Pageable pageable= PageRequest.of(page,size);
        return ApiResponse.<Page<UnitResponse>>builder()
                .Result(unitService.getAllByGroupUnitName(groupUnitName,pageable))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PostMapping
    public ApiResponse<UnitResponse> createUnit(
            @RequestBody UnitRequest unitRequest){
        return ApiResponse.<UnitResponse>builder()
                .Result(unitService.createUnit(unitRequest))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @PutMapping("/search/unitId/{unitId}")
    public ApiResponse<UnitResponse> createUnit(
            @RequestBody UnitForm update,
            @PathVariable String unitId){
        return ApiResponse.<UnitResponse>builder()
                .Result(unitService.updateUnit(update,unitId))
                .code(0)
                .message("SuccessFully")
                .success(true)
                .build();
    }
    @DeleteMapping("/{unitId}")
    public ApiResponse<String> deleteUnit(
            @PathVariable String unitId
    ){
        unitService.deleteUnit(unitId);
        return ApiResponse.<String>builder()
                .message("Deleted SuccessFull")
                .success(true)
                .code(0)
                .build();
    }
}
