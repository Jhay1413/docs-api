-- This is an empty migration.

CREATE OR REPLACE FUNCTION add_notification()
RETURNS TRIGGER AS $$
DECLARE
    fetch_user_data RECORD;
    concatenated_message TEXT;
BEGIN
    SELECT "firstName", "lastName" INTO fetch_user_data
    FROM "UserInfo"
    WHERE "accountId" = NEW."forwarderId";

    concatenated_message := fetch_user_data."firstName" || ' ' || fetch_user_data."lastName" || ' forwarded a transaction';

    IF TG_OP = 'INSERT' AND NEW.status <>'ARCHIVED' THEN
        INSERT INTO "Notification" (id,message,"receiverId","forwarderId","transactionId","isRead","createdAt","dateRead")
        VALUES (gen_random_uuid(),concatenated_message,NEW."forwarderId",NEW.id,false,NOW(),false);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND NEW.status <> 'ARCHIVED' AND NEW."dateReceived" IS NULL THEN
     INSERT INTO "Notification" (id,message,"receiverId","forwarderId","transactionId","isRead","createdAt","dateRead")
        VALUES (gen_random_uuid(),'forwarded a transaction',NEW."receiverId",NEW."forwarderId",NEW.id,false,NOW(),false);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
