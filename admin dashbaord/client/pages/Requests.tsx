import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Requests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pending Requests</h1>
        <p className="text-muted-foreground">All student enrollment requests in one place</p>
      </div>

      <Card>
        <CardContent className="py-16">
          <div className="text-center space-y-4">
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-medium">Pending Requests</h3>
              <p className="text-muted-foreground">
                This page shows a dedicated view of all pending student enrollment requests.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                For now, you can manage requests from the Students page.
              </p>
              <Link to="/students">
                <Button variant="outline">
                  Go to Students Page
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
