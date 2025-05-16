package com.ddd.warehouse.Controller;

import com.ddd.warehouse.Dto.Request.CostumerRequest;
import com.ddd.warehouse.Dto.Response.ApiResponse;
import com.ddd.warehouse.Dto.Response.Costumer.CostumerResponse;
import com.ddd.warehouse.Form.AddressUpdate;
import com.ddd.warehouse.Form.Costumerupdate;
import com.ddd.warehouse.Service.CostumerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Costumers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CostumerController {
    CostumerService CostumerService;
    @GetMapping("/getAll")
    public ApiResponse<List<CostumerResponse>> getall(){
        return ApiResponse.<List<CostumerResponse>>builder()
                .Result(CostumerService.getall())
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @GetMapping("/{id}")
    public ApiResponse<CostumerResponse> getById(@PathVariable String id){
        return ApiResponse.<CostumerResponse>builder()
                .Result(CostumerService.findById(id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();
    }
    @PostMapping("/create")
    public ApiResponse<CostumerResponse> createCostumer(@RequestBody CostumerRequest request){
        return ApiResponse.<CostumerResponse>builder()
                .Result(CostumerService.createCostumer(request))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @PutMapping("/update/{id}")
    public ApiResponse<CostumerResponse> updateCostumer(@RequestBody Costumerupdate update, @RequestParam String id){
        return ApiResponse.<CostumerResponse>builder()
                .Result(CostumerService.updateCostumer(update,id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @PutMapping("/update/address/{id}")
    public ApiResponse<CostumerResponse> updateAddressCostumer(@RequestBody AddressUpdate update, @RequestParam String id){
        return ApiResponse.<CostumerResponse>builder()
                .Result(CostumerService.updateAddressCostumer(update,id))
                .message("SuccessFull")
                .success(true)
                .code(0).build();

    }
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteById(@PathVariable String id){
        return ApiResponse.<String>builder()
                .Result(CostumerService.deletedCostumer(id))
                .message("Delete SuccessFull")
                .success(true)
                .code(0).build();
    }
}
