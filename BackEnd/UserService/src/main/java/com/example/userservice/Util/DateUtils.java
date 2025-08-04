package com.example.userservice.Util;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class DateUtils {

    static DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    static DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    /**
     * Convert String (yyyy-MM-dd) to LocalDate
     */
    public static Optional<LocalDate> parseToLocalDate(String dateStr) {
        try {
            return Optional.of(LocalDate.parse(dateStr, DATE_FORMAT));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Convert String (yyyy-MM-dd) to LocalDateTime (start of day)
     */
    public static Optional<LocalDateTime> parseToLocalDateTime(String dateStr) {
        return parseToLocalDate(dateStr).map(LocalDate::atStartOfDay);
    }

    /**
     * Convert LocalDate to String (yyyy-MM-dd)
     */
    public static String formatLocalDate(LocalDate date) {
        return date != null ? date.format(DATE_FORMAT) : null;
    }

    /**
     * Convert LocalDateTime to String (yyyy-MM-dd'T'HH:mm:ss)
     */
    public static String formatLocalDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMAT) : null;
    }
}