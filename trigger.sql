DELIMITER //

CREATE TRIGGER email_duplicate_trigger
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
  IF (SELECT COUNT(*) FROM Users WHERE emailAddress = NEW.emailAddress) > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Email already exists';
  END IF;
END //

DELIMITER ;
