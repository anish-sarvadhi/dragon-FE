import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  threadId: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  threadId: null,
};

// Real API call to your backend
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message: string, { dispatch, getState }) => {
    const state = getState() as { chat: ChatState };
    const currentThreadId = state.chat.threadId;
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: Date.now(),
    };
    dispatch(addMessage(userMessage));

    try {
      // Call your real API
      const response = await fetch(
        "https://dragon-be.onrender.com/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: message, thread_id: currentThreadId || null  }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();

       if (data.thread_id) {
        dispatch(setThreadId(data.thread_id));
      }

      const plainText =
        data.response ||
        data.answer ||
        data.message ||
        "I received your message but could not generate a response.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: plainText,
        sender: "bot",
        timestamp: Date.now(),
      };

      return botMessage;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setThreadId: (state, action: PayloadAction<string>) => {
      state.threadId = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.threadId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send message";
      });
  },
});

export const { addMessage, clearMessages, setThreadId } = chatSlice.actions;
export default chatSlice.reducer;
