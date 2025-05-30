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
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

// Real API call to your backend
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message: string, { dispatch }) => {
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
          body: JSON.stringify({ query: message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await response.json();
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
    clearMessages: (state) => {
      state.messages = [];
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

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
