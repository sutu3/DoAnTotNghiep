package com.ddd.warehouse.Service;

import com.ddd.warehouse.Dto.Request.CostumerRequest;
import com.ddd.warehouse.Dto.Response.Costumer.CostumerResponse;
import com.ddd.warehouse.Dto.Response.Costumer.CostumerResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Form.AddressUpdate;
import com.ddd.warehouse.Form.Costumerupdate;
import com.ddd.warehouse.Mapper.CostumerMapper;
import com.ddd.warehouse.Module.Costumer;
import com.ddd.warehouse.Module.Costumer;
import com.ddd.warehouse.Repo.CostumerRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class CostumerService {
    CostumerRepo costumerRepo;
    CostumerMapper costumerMapper;

    public List<CostumerResponse> getall(){
        return costumerRepo.findAll().stream()
                .map(costumerMapper::toResponse).collect(Collectors.toList());
    }
    public CostumerResponse findById(String id){
        Costumer Costumer= costumerRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.COSTUMER_NOT_FOUND));
        return costumerMapper.toResponse(Costumer);
    }
    public CostumerResponse createCostumer(CostumerRequest request){
        if(costumerRepo.existsByEmailAndPhoneNumber(request.email(),request.phoneNumber())){
            throw new AppException(ErrorCode.COSTUMER_EXIST);
        }
        Costumer Costumer= costumerMapper.toEntity(request);
        Costumer.setUrlImage("https://www.gettyimages.com/photos/Costumer-avatar");
        Costumer.setIsDeleted(false);
        return costumerMapper.toResponse(costumerRepo.save(Costumer));
    }
    public CostumerResponse updateCostumer(Costumerupdate update, String id){
        if(costumerRepo.existsByEmailAndPhoneNumber(update.email(),update.phoneNumber())){
            throw new AppException(ErrorCode.COSTUMER_EXIST);
        }
        Costumer Costumer= costumerRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.COSTUMER_NOT_FOUND));
        costumerMapper.updateCostumer(Costumer,update);
        return costumerMapper.toResponse(costumerRepo.save(Costumer));
    }
    public CostumerResponse updateAddressCostumer(AddressUpdate update, String id){
        Costumer Costumer= costumerRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.COSTUMER_NOT_FOUND));
        costumerMapper.updateAddressCostumer(Costumer,update);
        return costumerMapper.toResponse(costumerRepo.save(Costumer));
    }
    public String deletedCostumer(String id){
        Costumer Costumer= costumerRepo.findById(id)
                .orElseThrow(()->new AppException(ErrorCode.COSTUMER_NOT_FOUND));
        Costumer.setIsDeleted(true);
        Costumer.setDeletedAt(LocalDateTime.now());
        costumerRepo.save(Costumer);
        return "Deleted SuccessFull";

    }
}
