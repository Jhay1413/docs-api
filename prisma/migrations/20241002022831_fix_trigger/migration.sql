CREATE OR REPLACE FUNCTION add_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP= 'INSERT' AND NEW.status <> 'ARCHIVED'  THEN 
        INSERT INTO "Notification" (id,message,"receiverId","forwarderId","transactionId","isRead","createdAt")
        VALUES (gen_random_uuid(),'forwarded a transaction',NEW."receiverId",NEW."forwarderId",NEW.id,false,NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND NEW.status <> 'ARCHIVED' AND NEW."dateReceived" IS NULL THEN
     INSERT INTO "Notification" (id,message,"receiverId","forwarderId","transactionId","isRead","createdAt")
        VALUES (gen_random_uuid(),'forwarded a transaction',NEW."receiverId",NEW."forwarderId",NEW.id,false,NOW());
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
