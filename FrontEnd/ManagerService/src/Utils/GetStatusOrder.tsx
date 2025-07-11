export const getStatusFromBinAndQuantity = (item: any): 'pending' | 'checked' | 'imported' => {
    const hasBin = item.bin && item.bin.binId;
    const hasRealityQuantity = item.realityQuantity && item.realityQuantity > 0;

    if (hasBin && hasRealityQuantity) {
        return 'imported';
    } else if (hasRealityQuantity) {
        return 'checked';
    } else {
        return 'pending';
    }
};