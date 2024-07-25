
CREATE OR REPLACE FUNCTION transaction_log() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN 
INSERT INTO "TransactionLog" ("old_data","current_data",operation,"createdById","transactionId") VALUES ('new',"pld",TG_OP,NEW.forwardedById,NEW.id);
ELSIF TG_OP = 'UPDATE' THEN 
INSERT INTO "TransactionLog" ("old_data","current_data",operation,"createdById","transactionId") VALUES ("something old","something new"::text,TG_OP,NEW.forwardedById,NEW.id);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER transaction_trigger AFTER INSERT OR UPDATE ON "Transaction" FOR EACH ROW EXECUTE FUNCTION transaction_log()