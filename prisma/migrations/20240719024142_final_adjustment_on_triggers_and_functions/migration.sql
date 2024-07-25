
CREATE OR REPLACE FUNCTION transaction_log() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN 
INSERT INTO "TransactionLog" (old_data,current_data,operation,"createdById","transactionId") VALUES ('',row_to_json(NEW)::text,TG_OP,NEW."forwardedById",NEW.id);
ELSIF TG_OP = 'UPDATE' THEN 
INSERT INTO "TransactionLog" (old_data,current_data,operation,"createdById","transactionId") VALUES (row_to_json(OLD)::text,row_to_json(NEW)::text,TG_OP,NEW."forwardedById",NEW.id);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER transaction_trigger AFTER INSERT OR UPDATE ON "Transaction" FOR EACH ROW EXECUTE FUNCTION transaction_log()