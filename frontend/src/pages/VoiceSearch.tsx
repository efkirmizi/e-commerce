import React, { useState, useRef } from "react";
import api from "../axios"; // your axios instance

interface CategoryBase {
  id: number;
  name: string;
}

interface ProductBase {
  id: number;
  title: string;
  description?: string;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  is_published: boolean;
  created_at: string;
  category: CategoryBase;
}

const VoiceLiveSearch: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // stop mic
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Could not start recording. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");

      const res = await api.post<{ data: ProductBase[] }>("/products/voice_search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts(res.data.data);
    } catch (e) {
      console.error(e);
      setError("Voice search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Live Voice Search Products</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Stop Recording
          </button>
        )}
      </div>

      {loading && <p>Processing voice search...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {products.length === 0 && !loading && (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                {product.description || "No description"}
              </p>
              <p className="text-xs text-gray-500 mt-2">Category: {product.category.name}</p>
              <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceLiveSearch;
