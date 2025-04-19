import React, { useState, useEffect } from 'react';
import { Layout } from '@/Layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  History as HistoryIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface HistoryEntry {
  _id: string;
  image: string;
  prediction: {
    disease: string;
    confidence: number;
    top_3_predictions: Array<{
      class: string;
      confidence: number;
    }>;
  };
  treatmentInfo: any;
  createdAt: string;
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isAuthenticated } = useAuth();

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/history?page=${page}`);
      setHistory(response.data.history);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      setError('Failed to fetch history');
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory(1);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/history/${id}`);
      toast.success('History entry deleted');
      fetchHistory(currentPage);
    } catch (error) {
      toast.error('Failed to delete history entry');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Please login to view your history
            </h2>
            <Button onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HistoryIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Detection History</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <Card className="p-6 text-center text-red-600">{error}</Card>
        ) : history.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl text-gray-600">No detection history found</h2>
          </Card>
        ) : (
          <>
            <div className="grid gap-6">
              {history.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={entry.image}
                          alt="Plant"
                          className="rounded-lg max-h-64 object-cover w-full"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-green-800">
                              {entry.prediction.disease.replace(/_/g, ' ')}
                            </h3>
                            <Badge className="mt-2">
                              {(entry.prediction.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700">Treatment Summary:</h4>
                          <div className="text-sm text-gray-600">
                            {entry.treatmentInfo && 
                              Object.entries(entry.treatmentInfo)
                                .filter(([key]) => key !== 'originalText')
                                .slice(0, 2)
                                .map(([section, items]) => (
                                  <div key={section} className="mb-2">
                                    <p className="font-medium">{section}:</p>
                                    <ul className="list-disc pl-5">
                                      {Array.isArray(items) && 
                                        items.slice(0, 2).map((item, idx) => (
                                          <li key={idx}>
                                            {typeof item === 'string' ? item : 
                                              item.name ? `${item.name}` : 
                                              item.text || ''}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))
                            }
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(entry._id)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchHistory(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchHistory(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;