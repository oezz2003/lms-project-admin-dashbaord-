import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Wrench } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your educational platform preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>
              Platform configuration and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage admin users and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Set up email notifications and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure payment gateways and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Settings</CardTitle>
            <CardDescription>
              Default course configurations and templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>
              Platform analytics and reporting settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Wrench className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <Wrench className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-medium">Settings Panel</h3>
              <p className="text-muted-foreground">
                The settings functionality is being developed. You can continue prompting to add specific settings pages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
