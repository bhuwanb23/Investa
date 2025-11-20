"""
Tests for user views
"""

from django.test import TestCase
from rest_framework.test import APIClient


class Testuserviews(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_list(self):
        response = self.client.get("/api/")
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        data = {}
        response = self.client.post("/api/", data)
        self.assertIn(response.status_code, [200, 201, 400])
