import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Copy, Sparkles, ChefHat, Heart, Send } from "lucide-react";

const RecipeMaker = () => {
  const [dishInput, setDishInput] = useState<string>("");
  const [generatedRecipe, setGeneratedRecipe] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateRecipe = async () => {
    if (!dishInput.trim()) {
      setGeneratedRecipe("Please enter what you'd like to eat!");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoading("Generating your recipe...");

    try {
      const response = await fetch("http://localhost:5678/webhook-test/4019b6af-bdeb-43b1-88b4-5cbeece03333", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dish: dishInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the webhook returns a JSON object with a 'recipe' field
      setGeneratedRecipe(data.recipe || "Recipe generated successfully, but no specific recipe text was returned from the webhook.");
      showSuccess("Recipe generated successfully!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      showError("Failed to generate recipe. Please check your connection or try again.");
      setGeneratedRecipe("Failed to generate recipe. Please check your connection or try again later.");
    } finally {
      dismissToast(loadingToastId);
      setIsLoading(false);
    }
  };

  const handleCopyRecipe = async () => {
    if (generatedRecipe) {
      try {
        await navigator.clipboard.writeText(generatedRecipe);
        showSuccess("Recipe copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy recipe: ", err);
        showError("Failed to copy recipe.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center flex flex-col items-center justify-center text-center p-4"
        style={{ backgroundImage: "url('/hero-banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay adjusted to opacity-50 */}
        {/* Watermark Image */}
        <img
          src="/chef-hat-watermark.png" // Make sure this path is correct
          alt="Chef Hat Watermark"
          className="absolute inset-0 w-full h-full object-contain opacity-10 z-0"
        />
        <div className="relative z-10 text-white">
          <h1 className="text-5xl font-bold text-orange-400 mb-4 drop-shadow-lg">
            Kim's Quick Recipe Maker
          </h1>
          <p className="text-xl text-gray-100 mb-6">
            Tell me what you want to eat, and I'll create a personalized recipe just for you! <span role="img" aria-label="heart">❤️</span>
          </p>
          <div className="flex items-center justify-center space-x-4 text-lg">
            <span className="flex items-center gap-2 text-orange-300">
              <Sparkles className="h-5 w-5" /> AI-Powered
            </span>
            <span className="flex items-center gap-2 text-orange-300">
              <ChefHat className="h-5 w-5" /> Personalized
            </span>
            <span className="flex items-center gap-2 text-green-400">
              <Heart className="h-5 w-5" /> Delicious
            </span>
          </div>
        </div>
      </div>

      {/* Main Recipe Input/Chat Card */}
      <Card className="w-full max-w-2xl shadow-lg rounded-lg bg-white dark:bg-gray-800 mt-8 mb-8">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Textarea
              id="dish-input"
              placeholder="help me create a healthy recipe for..."
              value={dishInput}
              onChange={(e) => setDishInput(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 min-h-[100px]"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">tools</span>
              <Button
                variant="outline"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 border-purple-600 dark:border-purple-700"
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4 mr-2" /> recipe creator
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800 border-orange-300 dark:border-orange-700"
                disabled={isLoading}
              >
                <ChefHat className="h-4 w-4 mr-2" /> meal planner
              </Button>
            </div>
            <Button
              onClick={handleGenerateRecipe}
              className="py-2 px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Submit"}
              <Send className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {generatedRecipe && (
            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Recipe:</h2>
                <Button
                  onClick={handleCopyRecipe}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4" />
                  Copy Recipe
                </Button>
              </div>
              <Textarea
                value={generatedRecipe}
                readOnly
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 resize-y"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default RecipeMaker;