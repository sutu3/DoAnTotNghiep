package com.ddd.warehouse.Service.Impl;

import com.ddd.warehouse.Dto.Request.BinRequest;
import com.ddd.warehouse.Dto.Request.StackRequest;
import com.ddd.warehouse.Dto.Response.Bin.BinResponse;
import com.ddd.warehouse.Dto.Response.Bin.BinResponseNoWarehouse;
import com.ddd.warehouse.Dto.Response.Stack.StackResponse;
import com.ddd.warehouse.Exception.AppException;
import com.ddd.warehouse.Exception.ErrorCode;
import com.ddd.warehouse.Mapper.StackMapper;
import com.ddd.warehouse.Module.Bins;
import com.ddd.warehouse.Module.Stacks;
import com.ddd.warehouse.Service.BinService;
import com.ddd.warehouse.Service.StackService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Array;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class StackBinOrchestratorService {
    private final StackMapper stackMapper;

    StackService stackService;
    BinService binService;
    @Transactional
    public StackResponse createStackAndBins(StackRequest stackRequest) {
        StackResponse stackCreated = stackService.createStack(stackRequest);

        List<BinResponseNoWarehouse> bins = new ArrayList<>();
        if (stackRequest.binQuantity() > 0) {
            for (int i = 1; i <= stackRequest.binQuantity(); i++) {
                // Sanitize trước
                String sanitizedStackName = stackRequest.stackName()
                        .toUpperCase()
                        .replaceAll("[^A-Z0-9]", "");

                // Fix lỗi substring bằng cách cắt theo độ dài của chuỗi đã sanitize
                String trimmedName = sanitizedStackName.substring(0, Math.min(10, sanitizedStackName.length()));

                String binCode = String.format("%s-BIN-%03d", trimmedName, i);

                BinRequest bin = BinRequest.builder()
                        .binCode(binCode)
                        .capacity(BigDecimal.valueOf(1))
                        .stack(stackCreated.getStackId())
                        .warehouse(stackRequest.warehouse())
                        .build();
                bins.add(binService.createBin(bin));
            }
        }

        // Lấy lại Stack từ DB
        Stacks fullStack = stackService.getById(stackCreated.getStackId());

        // Map sang response và set danh sách bin
        StackResponse response = stackMapper.toResponse(fullStack);
        response.setBin(bins);
        return response;
    }

    public StackResponse getStackByBinId(String binId) {
        Bins bin = binService.getById(binId);

        Stacks stack = bin.getStack();

        if (stack == null) {
            throw new AppException(ErrorCode.STACK_NOT_FOUND);
        }

        return stackMapper.toResponse(stack);
    }

}

