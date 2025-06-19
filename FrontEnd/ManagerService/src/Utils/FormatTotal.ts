const formatTotal = (total: number): string | number => {
    return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

export { formatTotal };