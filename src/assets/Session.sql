CREATE EVENT IF NOT EXISTS session_cleanup
ON SCHEDULE EVERY 10 MINUTE
DO
BEGIN
    DECLARE cutoff_time DATETIME;
    SET cutoff_time = NOW() - INTERVAL 10 MINUTE;

    UPDATE user_table_session
    SET expire_date = NOW()
    WHERE expire_date IS NULL AND reg_date <= cutoff_time;
END;

SET GLOBAL event_scheduler = ON;