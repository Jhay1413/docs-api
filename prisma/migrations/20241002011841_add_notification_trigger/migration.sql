-- This is an empty migration.


CREATE OR REPLACE FUNCTION add_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP= 'INSERT' AND NEW.status <> 'ARCHIVED'  THEN 
        INSERT INTO "Notification" (message,"receiverId","forwarderId","transactionId","isRead","createAt")
        VALUES ('forwarded a transaction',NEW."receiverId",NEW."forwarderId",NEW.id,false,NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND NEW.status <> "ARCHIVED" THEN
     INSERT INTO "Notification" (message,"receiverId","forwarderId","transactionId","isRead","createAt")
        VALUES ('forwarded a transaction',NEW."receiverId",NEW."forwarderId",NEW.id,false,NOW());
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER notification_on_insert_or_update
AFTER INSERT OR UPDATE ON "Transaction"
FOR EACH ROW
EXECUTE FUNCTION add_notification();
