-- This is an empty migration.


CREATE OR REPLACE FUNCTION transaction_log()
RETURNS TRIGGER AS $$
DECLARE
    old_attachment_data JSON;
    new_attachment_data JSON;
BEGIN 
    SELECT json_agg(row_to_json(a))
    INTO new_attachment_data
    FROM "Attachment" a
    WHERE a."transactionId" = NEW.id;


    IF TG_OP = 'INSERT' THEN
        INSERT INTO "TransactionLog" (old_data,current_data,operation,"createdById","transactionId")
        VALUES(
            '',
            json_build_object(
                'transaction',row_to_json(NEW),
                'attachments',new_attachment_data
            )::text,
            TG_OP,
            NEW."forwardedById",
            NEW.id
        );
    END IF;
    RETURN NEW; 
    END;
    $$ LANGUAGE plpgsql;