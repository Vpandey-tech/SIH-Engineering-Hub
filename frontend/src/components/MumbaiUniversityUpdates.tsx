import React, { useEffect, useState } from "react";
import { Newspaper, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { db } from "../firebaseClient"; // Import Firestore from your firebase.js
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth'; // Add this
import { auth } from '../firebaseClient'; // Add this

interface UpdateItem {
  title: string;
  date: string;
  description: string;
  source: string;
}

const MumbaiUniversityUpdates = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth); // Add authentication state

  useEffect(() => {
    // Load cached updates from localStorage on initial render
    try {
      const cachedUpdates = localStorage.getItem("mu-updates");
      if (cachedUpdates) {
        const parsedUpdates = JSON.parse(cachedUpdates);
        setUpdates(parsedUpdates);
        console.log("Loaded cached updates:", parsedUpdates);
      }
    } catch (e) {
      console.error("Failed to parse cached updates:", e);
      localStorage.removeItem("mu-updates"); // Clear corrupted cache
    }

    // console.log("Current user:", user); // Debug user authentication
    if (!user) {
      console.warn("User not authenticated. Updates may not load.");
      setError("Please log in to view updates.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch updates from Firestore
    const fetchUpdates = async () => {
      try {
        const updatesCollection = collection(db, "mumbai-updates"); // Updated to match your collection name
        const updatesQuery = query(updatesCollection, orderBy("date", "desc"), limit(5)); // Get latest 5 updates
        const updatesSnapshot = await getDocs(updatesQuery);
        if (updatesSnapshot.empty) {
          console.log("No documents found in 'mumbai-updates' collection");
          setError("No updates found in Firestore. Check collection.");
          return;
        }
        const updatesList: UpdateItem[] = updatesSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Document data:", data); // Log each document for debugging
          return {
            id: doc.id,
            title: data.title || "No title",
            date: data.date || "No date",
            description: data.description || "No description",
            source: data.source || "#",
          } as UpdateItem;
        });

        if (updatesList.length === 0) {
          console.log("Mapped updates list is empty");
          setError("No valid updates mapped from Firestore.");
          return;
        }

        setUpdates(updatesList);
        // Cache updates in localStorage
        try {
          localStorage.setItem("mu-updates", JSON.stringify(updatesList));
          console.log("Cached updates:", updatesList);
        } catch (e) {
          console.error("Failed to cache updates:", e);
        }
        setLoading(false);
      } catch (err) {
        console.error("Firestore fetch error:", err);
        setError("Failed to fetch updates from Firestore. Showing cached data.");
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [user]); // Add user as dependency to re-fetch on login

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Mumbai University Updates
        </CardTitle>
        <CardDescription>
          {loading && <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />}
          Latest circulars and notifications from MU.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            {error}
          </div>
        )}

        {loading && updates.length === 0 ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : updates.length > 0 ? (
          <div>
            {updates.slice(0, 5).map((u, i) => (
              <div key={i} className="mb-4">
                <a
                  href={u.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {u.title}
                </a>
                <div className="text-sm text-gray-600">
                  {u.date}
                  {u.description ? ` – ${u.description}...` : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-600">No updates available.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default MumbaiUniversityUpdates;