
import React, { useState, useCallback } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { analyzeStickerContent, generateStickerDescription } from '../services/geminiService';
import { GeminiAnalysisResult, GroundingChunkWeb } from '../types';
import { LightBulbIcon } from '../components/icons/HeroIcons';

const GeminiContentAnalysisPage: React.FC = () => {
  const [stickerName, setStickerName] = useState<string>('Happy Sunshine');
  const [stickerDescriptionInput, setStickerDescriptionInput] = useState<string>('A bright yellow sun smiling happily, radiating warmth and joy. Perfect for kids and summer themes.');
  const [stickerImageUrl, setStickerImageUrl] = useState<string>('https://picsum.photos/seed/sunshine/300/300'); // Placeholder
  
  const [analysisResult, setAnalysisResult] = useState<GeminiAnalysisResult | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeContent = useCallback(async () => {
    if (!stickerDescriptionInput && !stickerImageUrl) {
      setError('Please provide a description or an image URL for analysis.');
      return;
    }
    setError(null);
    setIsLoadingAnalysis(true);
    setAnalysisResult(null);
    try {
      // In a real app, you might convert image URL to base64 if sending image data
      // For this example, we'll primarily use the description for text-based analysis
      const result = await analyzeStickerContent(stickerDescriptionInput, stickerImageUrl /* optional image data */);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error("Error analyzing content:", err);
      setError(err.message || 'Failed to analyze content.');
      setAnalysisResult({ error: err.message || 'Failed to analyze content.' });
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [stickerDescriptionInput, stickerImageUrl]);

  const handleGenerateDescription = useCallback(async () => {
    if (!stickerName) {
      setError('Please provide a sticker name to generate a description.');
      return;
    }
    setError(null);
    setIsLoadingDescription(true);
    setGeneratedDescription(null);
    try {
      const description = await generateStickerDescription(stickerName, stickerDescriptionInput /* existing keywords/desc */);
      setGeneratedDescription(description);
    } catch (err: any) {
      console.error("Error generating description:", err);
      setError(err.message || 'Failed to generate description.');
    } finally {
      setIsLoadingDescription(false);
    }
  }, [stickerName, stickerDescriptionInput]);

  const renderSources = (sources?: GroundingChunkWeb[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-gray-300">Sources:</h4>
        <ul className="list-disc list-inside text-xs text-gray-400">
          {sources.map((source, index) => (
            <li key={index}>
              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-400">
                {source.title || source.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">AI Content Tools</h2>
      
      <Card title="Sticker Content Analyzer" className="bg-gray-850">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="stickerName" className="block text-sm font-medium text-gray-300 mb-1">Sticker Name (for context)</label>
            <input
              id="stickerName"
              type="text"
              value={stickerName}
              onChange={(e) => setStickerName(e.target.value)}
              placeholder="e.g., Cool Cat"
              className="w-full p-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="stickerImageUrl" className="block text-sm font-medium text-gray-300 mb-1">Sticker Image URL (Optional)</label>
            <input
              id="stickerImageUrl"
              type="text"
              value={stickerImageUrl}
              onChange={(e) => setStickerImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full p-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="stickerDescriptionInput" className="block text-sm font-medium text-gray-300 mb-1">Sticker Description / Keywords</label>
          <textarea
            id="stickerDescriptionInput"
            rows={4}
            value={stickerDescriptionInput}
            onChange={(e) => setStickerDescriptionInput(e.target.value)}
            placeholder="Enter sticker description, keywords, or themes..."
            className="w-full p-2 bg-gray-700 text-gray-200 rounded-md border border-gray-600"
          />
        </div>
        <div className="mt-6 flex space-x-4">
          <Button onClick={handleAnalyzeContent} isLoading={isLoadingAnalysis} disabled={isLoadingAnalysis || isLoadingDescription}>
            Analyze Content
          </Button>
           <Button onClick={handleGenerateDescription} isLoading={isLoadingDescription} disabled={isLoadingAnalysis || isLoadingDescription} variant="outline" leftIcon={<LightBulbIcon className="h-5 w-5"/>}>
            Generate Description
          </Button>
        </div>

        {error && <p className="mt-4 text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md">{error}</p>}
        
        {isLoadingAnalysis && <Spinner className="mt-6" />}
        {analysisResult && !isLoadingAnalysis && (
          <Card title="Analysis Result" className="mt-6 bg-gray-800 border-gray-700">
            {analysisResult.error && <p className="text-red-400">{analysisResult.error}</p>}
            {analysisResult.summary && <p><strong className="text-gray-200">Summary:</strong> {analysisResult.summary}</p>}
            {analysisResult.suggestedTags && analysisResult.suggestedTags.length > 0 && (
              <div className="mt-2">
                <strong className="text-gray-200">Suggested Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysisResult.suggestedTags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            {analysisResult.sentiment && <p className="mt-2"><strong className="text-gray-200">Sentiment:</strong> {analysisResult.sentiment}</p>}
            {analysisResult.safetyRating && <p className="mt-2"><strong className="text-gray-200">Safety Rating:</strong> {analysisResult.safetyRating}</p>}
            {renderSources(analysisResult.sources)}
          </Card>
        )}

        {isLoadingDescription && <Spinner className="mt-6" />}
        {generatedDescription && !isLoadingDescription && (
           <Card title="Generated Description" className="mt-6 bg-gray-800 border-gray-700">
            <p className="whitespace-pre-wrap">{generatedDescription}</p>
          </Card>
        )}
      </Card>

      <Card title="How it works (Conceptual)" className="bg-gray-850">
        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
            <li><strong>Content Analysis:</strong> The "Analyze Content" feature (conceptually) uses Gemini to process the provided sticker description and/or image. It can:
                <ul className="list-['-_'] list-inside ml-4 space-y-1">
                    <li>Generate a brief summary of the content.</li>
                    <li>Suggest relevant tags or keywords.</li>
                    <li>Assess sentiment (e.g., positive, neutral, negative).</li>
                    <li>Provide a conceptual safety/moderation rating (e.g., safe, caution, unsafe for certain content types).</li>
                    <li>If Google Search grounding is enabled for a query, it can provide web sources.</li>
                </ul>
            </li>
            <li><strong>Description Generation:</strong> The "Generate Description" feature uses Gemini to craft a compelling and creative description for a sticker based on its name and any provided keywords.</li>
            <li><strong>Image Input (Future):</strong> For actual image analysis (e.g., object detection, explicit content detection), the image would need to be converted to a base64 string and sent as part of a multipart request to a multimodal Gemini model. This example focuses on text input.</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">Note: Actual API calls and results depend on the specific Gemini model used and the prompt engineering. This is a simplified demonstration.</p>
      </Card>

    </div>
  );
};

export default GeminiContentAnalysisPage;
