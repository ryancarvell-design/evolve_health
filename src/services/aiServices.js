import genAI from './geminiClient';

/**
 * Generates text response based on user input using Gemini AI.
 * @param {string} prompt - The user's input prompt.
 * @returns {Promise<string>} The generated text.
 */
export async function generateText(prompt) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error in text generation:', error);
    throw error;
  }
}

/**
 * Streams text response chunk by chunk for real-time experience.
 * @param {string} prompt - The user's input prompt.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function streamText(prompt, onChunk) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model?.generateContentStream(prompt);

    for await (const chunk of result?.stream) {
      const text = chunk?.text();
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error('Error in streaming text generation:', error);
    throw error;
  }
}

/**
 * Generates AI suggestions for document improvement.
 * @param {string} documentContent - The current document content.
 * @param {string} documentType - Type of document (e.g., 'medical', 'therapy').
 * @returns {Promise<Array>} Array of suggestion objects.
 */
export async function generateDocumentSuggestions(documentContent, documentType = 'medical') {
  try {
    const prompt = `
Please analyze this ${documentType} document and provide specific improvement suggestions in JSON format. 
Focus on grammar, medical terminology, structure, and completeness.

Document content:
${documentContent}

Return suggestions as a JSON array with objects containing:
- type: "grammar", "medical", "structure", or "completeness"
- text: descriptive suggestion text
- position: estimated line or section reference
- severity: "low", "medium", or "high"

Limit to 5 most important suggestions.
`;

    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });
    
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    // Parse JSON response
    try {
      const suggestions = JSON.parse(text);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (parseError) {
      console.warn('Failed to parse AI suggestions as JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error generating document suggestions:', error);
    throw error;
  }
}

/**
 * Adjusts document tone based on selected style.
 * @param {string} content - The document content to adjust.
 * @param {string} targetTone - Desired tone ('professional', 'conversational', 'technical', 'concise').
 * @returns {Promise<string>} The adjusted content.
 */
export async function adjustDocumentTone(content, targetTone) {
  const toneInstructions = {
    professional: 'Use formal medical terminology and professional language suitable for clinical documentation.',
    conversational: 'Use patient-friendly language that is easy to understand while maintaining medical accuracy.',
    technical: 'Use detailed clinical language with specific medical terms and thorough explanations.',
    concise: 'Use brief, to-the-point language while maintaining all essential information.'
  };

  try {
    const prompt = `
Please rewrite the following medical document content with a ${targetTone} tone:

${toneInstructions?.[targetTone]}

Original content:
${content}

Rewritten content:
`;

    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2000,
      }
    });
    
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error adjusting document tone:', error);
    throw error;
  }
}

/**
 * Generates document summary with key insights.
 * @param {string} content - The document content to summarize.
 * @returns {Promise<Object>} Summary data including word count, reading time, and key points.
 */
export async function generateDocumentSummary(content) {
  try {
    const wordCount = content?.split(/\s+/)?.length || 0;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    const prompt = `
Please analyze this medical document and extract 4-5 key points in JSON format:

Document:
${content}

Return as JSON object with structure:
{
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}

Focus on:
- Main diagnosis or condition
- Key findings or assessments  
- Treatment plans or recommendations
- Important follow-up actions
- Critical patient information
`;

    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      }
    });
    
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        wordCount,
        readingTime: readingTime + ' min',
        keyPoints: parsed?.keyPoints || []
      };
    } catch (parseError) {
      return {
        wordCount,
        readingTime: readingTime + ' min',
        keyPoints: ['Unable to generate key points at this time']
      };
    }
  } catch (error) {
    console.error('Error generating document summary:', error);
    throw error;
  }
}

/**
 * Generates content based on multimodal input (text and image).
 * @param {string} prompt - Text prompt.
 * @param {File} imageFile - Image file.
 * @returns {Promise<string>} Generated text response.
 */
export async function generateTextFromImage(prompt, imageFile) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Convert image file to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

    const imageBase64 = await toBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageFile?.type,
      },
    };

    const result = await model?.generateContent([prompt, imagePart]);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error in multimodal generation:', error);
    throw error;
  }
}

/**
 * Creates a chat session with conversation history.
 * @param {string} message - User message.
 * @param {Array} history - Chat history array.
 * @returns {Promise<Object>} Response with updated history.
 */
export async function chatWithHistory(message, history = []) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model?.startChat({ history });

    const result = await chat?.sendMessage(message);
    const response = await result?.response;
    const text = response?.text();

    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text }] },
    ];

    return { response: text, updatedHistory };
  } catch (error) {
    console.error('Error in chat session:', error);
    throw error;
  }
}