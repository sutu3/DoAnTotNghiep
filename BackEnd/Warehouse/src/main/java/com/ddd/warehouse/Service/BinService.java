package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponseNoWarehouse;
import com.ddd.warehouse.Form.BinForm;
import com.ddd.warehouse.Module.Bins;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public interface BinService {
    Page<BinResponse> getAll(Pageable pageable);
    Page<BinResponse> getAllByWarehouseId(Pageable pageable, String warehouseId);
    List<BinResponse> getAllListByWarehouseId(String warehouseId);
    Page<BinResponse> getAllByStackName(Pageable pageable, String stackName);
    BinResponse getByBinCodeResponse(String BinName,String stackName,String warehouseId);
    Bins getByBinCode(String BinName,String stackName,String warehouseId);
    Boolean exsistByBinCode(String BinName,String stackName,String warehouseId);
    Bins getById(String BinId);
    BinResponse getByIdResponse(String BinId);
    BinResponseNoWarehouse createBin(BinRequest BinRequest);
    BinResponse updateBin(BinForm update, String BinId);
    String deleteBin(String BinId);
}
