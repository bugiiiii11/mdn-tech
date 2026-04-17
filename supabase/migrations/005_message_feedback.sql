-- Message feedback table for chatbot conversation analysis
CREATE TABLE message_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  chatbot_id uuid NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  rating text NOT NULL CHECK (rating IN ('correct', 'incorrect', 'helpful', 'not_helpful')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, customer_id)
);

ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;

-- Customers can rate messages for their own chatbots
CREATE POLICY "customers manage their feedback"
ON message_feedback
FOR ALL
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());
