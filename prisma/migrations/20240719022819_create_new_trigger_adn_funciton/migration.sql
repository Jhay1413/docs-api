CREATE OR REPLACE FUNCTION transaction_log() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN 
INSERT INTO "TransactionLog" ("old_data","current_data",operation,"createdById","transactionId") VALUES ('','something new',TG_OP,NEW.forwardedById,NEW.id);
ELSIF TG_OP = 'UPDATE' THEN 
INSERT INTO "TransactionLog" ("old_data","current_data",operation,"createdById","transactionId") VALUES ('something old','something new',TG_OP,NEW.forwardedById,NEW.id);
END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER transaction_trigger AFTER INSERT OR UPDATE ON "Transaction" FOR EACH ROW EXECUTE FUNCTION transaction_log()