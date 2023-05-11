DELIMITER //
CREATE PROCEDURE PopularVideoAndViewers()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_videoID VARCHAR(256);
    DECLARE cur CURSOR FOR
        SELECT videoID
        FROM Video
        ORDER BY view_count DESC
        LIMIT 5;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    DROP TEMPORARY TABLE IF EXISTS Result;
    CREATE TEMPORARY TABLE Result (
        userID VARCHAR(256),
        FirstName VARCHAR(256),
        LastName VARCHAR(256),
        videoID VARCHAR(256)
    );

    OPEN cur;
    REPEAT
        FETCH NEXT FROM cur INTO v_videoID;
        IF NOT done THEN
            INSERT INTO Result (userID, FirstName, LastName, videoID)
            SELECT Users.userID, Users.FirstName, Users.LastName, History.videoID
            FROM Users
            INNER JOIN Preferences ON Users.userID = Preferences.userID
            INNER JOIN History ON Users.userID = History.userID
            WHERE (Preferences.averageIncome > 70000 OR Preferences.averageIncome < 30000)
            AND History.videoID = v_videoID;
        END IF;
    UNTIL done END REPEAT;
    CLOSE cur;

    SELECT * FROM Result;
END //
DELIMITER ;

