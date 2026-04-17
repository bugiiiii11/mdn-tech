'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  message_feedback?: Array<{
    id: string;
    rating: 'correct' | 'incorrect' | 'helpful' | 'not_helpful';
  }> | null;
}

// Client-side feedback loader
async function loadFeedbackForMessages(messageIds: string[]): Promise<Map<string, any>> {
  if (messageIds.length === 0) return new Map();

  try {
    const response = await fetch('/api/portal/feedback/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageIds }),
    });

    if (!response.ok) throw new Error('Failed to load feedback');
    const feedbacks = await response.json();

    const feedbackMap = new Map<string, any>();
    feedbacks.forEach((f: any) => {
      feedbackMap.set(f.message_id, f);
    });
    return feedbackMap;
  } catch (error) {
    console.error('Error loading feedback:', error);
    return new Map();
  }
}

interface Conversation {
  id: string;
  visitor_id: string;
  source_url: string;
  started_at: string;
  message_count: number;
  chat_messages: Message[];
}

interface ConversationViewerProps {
  conversations: Conversation[];
  fallbackMessage: string;
  chatbotId: string;
}

export function ConversationViewer({
  conversations,
  fallbackMessage,
  chatbotId,
}: ConversationViewerProps) {
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    // Load feedback for all messages
    const messageIds = conversations.flatMap(conv =>
      (conv.chat_messages as any[])?.map(msg => msg.id) || []
    );

    loadFeedbackForMessages(messageIds).then(setFeedbackMap);
  }, [conversations]);

  if (conversations.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No conversations found</p>
      </div>
    );
  }

  const handleFeedback = async (messageId: string, rating: string) => {
    setSubmittingId(messageId);
    try {
      const response = await fetch(`/api/portal/feedback/${messageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, chatbotId }),
      });
      if (!response.ok) throw new Error('Failed to save feedback');
    } catch (error) {
      console.error('Feedback error:', error);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {conversations.map((conv) => {
        const isExpanded = expandedConvId === conv.id;
        const startDate = new Date(conv.started_at);
        const isFallbackConv = conv.chat_messages.some(
          (msg) =>
            msg.role === 'assistant' &&
            msg.content.toLowerCase().includes(fallbackMessage.toLowerCase())
        );

        return (
          <div
            key={conv.id}
            className={`border rounded-lg overflow-hidden transition-colors ${
              isExpanded
                ? 'border-gray-700 bg-gray-900'
                : 'border-gray-800 bg-gray-950 hover:border-gray-700'
            }`}
          >
            {/* Header */}
            <button
              onClick={() => setExpandedConvId(isExpanded ? null : conv.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-300 font-medium truncate">
                      {conv.visitor_id}
                    </span>
                    {isFallbackConv && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-900/30 border border-amber-700 rounded text-xs text-amber-300">
                        <AlertCircle size={12} />
                        Has fallback
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString()} •{' '}
                    {conv.message_count} messages
                  </p>
                </div>
              </div>
            </button>

            {/* Messages (expanded) */}
            {isExpanded && (
              <div className="border-t border-gray-800 px-4 py-3 space-y-4 bg-gray-900/50">
                {conv.chat_messages.length === 0 ? (
                  <p className="text-xs text-gray-500 py-2">No messages in this conversation</p>
                ) : (
                  conv.chat_messages.map((msg) => {
                    const msgTime = new Date(msg.created_at);
                    const isFallback =
                      msg.role === 'assistant' &&
                      msg.content.toLowerCase().includes(fallbackMessage.toLowerCase());

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 p-3 rounded-lg ${
                          isFallback
                            ? 'bg-amber-900/20 border border-amber-700/40'
                            : 'bg-gray-800/30 border border-gray-700/30'
                        }`}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">
                          {msg.role === 'user' ? '👤' : '🤖'}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-300">
                              {msg.role === 'user' ? 'User' : 'Bot'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msgTime.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">
                            {msg.content}
                          </p>

                          {/* Feedback buttons for assistant messages */}
                          {msg.role === 'assistant' && (
                            <div className="flex gap-2 mt-3">
                              {(() => {
                                const feedback = feedbackMap.get(msg.id);
                                const rating = feedback?.rating;
                                return (
                                  <>
                                    <button
                                      onClick={() => handleFeedback(msg.id, 'correct')}
                                      disabled={submittingId === msg.id}
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                        rating === 'correct'
                                          ? 'bg-green-900/50 text-green-300 border border-green-700'
                                          : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 border border-gray-600'
                                      } disabled:opacity-50`}
                                      title="Mark as correct answer"
                                    >
                                      <ThumbsUp size={14} />
                                      <span>Correct</span>
                                    </button>

                                    <button
                                      onClick={() => handleFeedback(msg.id, 'incorrect')}
                                      disabled={submittingId === msg.id}
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                        rating === 'incorrect'
                                          ? 'bg-red-900/50 text-red-300 border border-red-700'
                                          : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 border border-gray-600'
                                      } disabled:opacity-50`}
                                      title="Mark as incorrect answer"
                                    >
                                      <ThumbsDown size={14} />
                                      <span>Incorrect</span>
                                    </button>

                                    <button
                                      onClick={() => handleFeedback(msg.id, 'helpful')}
                                      disabled={submittingId === msg.id}
                                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                        rating === 'helpful'
                                          ? 'bg-blue-900/50 text-blue-300 border border-blue-700'
                                          : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 border border-gray-600'
                                      } disabled:opacity-50`}
                                      title="Mark as helpful"
                                    >
                                      <span>✋ Helpful</span>
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
