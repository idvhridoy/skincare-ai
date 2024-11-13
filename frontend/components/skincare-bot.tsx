'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function SkincareBotComponent() {
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState({
    gender: '',
    age: '',
    skinType: '',
    skinConcerns: [],
    currentRoutine: [],
    allergies: '',
    budget: '',
    preferredBrands: []
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value })
  }

  const handleMultiSelect = (field, value) => {
    const updatedValues = userData[field].includes(value)
      ? userData[field].filter(item => item !== value)
      : [...userData[field], value]
    setUserData({ ...userData, [field]: updatedValues })
  }

  const handleNextStep = () => {
    setStep(step + 1)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const data = await response.json()
      setRecommendations(data)
      setStep(6)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Step 1: Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  placeholder="Enter your age"
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Step 2: Skin Type</h2>
            <RadioGroup onValueChange={(value) => handleInputChange('skinType', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dry" id="dry" />
                <Label htmlFor="dry">Dry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oily" id="oily" />
                <Label htmlFor="oily">Oily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="combination" id="combination" />
                <Label htmlFor="combination">Combination</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal">Normal</Label>
              </div>
            </RadioGroup>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Step 3: Skin Concerns</h2>
            <div className="space-y-2">
              {['Acne', 'Aging', 'Dryness', 'Dullness', 'Hyperpigmentation', 'Redness', 'Sensitivity'].map((concern) => (
                <div className="flex items-center space-x-2" key={concern}>
                  <Checkbox
                    id={concern.toLowerCase()}
                    checked={userData.skinConcerns.includes(concern.toLowerCase())}
                    onCheckedChange={() => handleMultiSelect('skinConcerns', concern.toLowerCase())}
                  />
                  <Label htmlFor={concern.toLowerCase()}>{concern}</Label>
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Step 4: Current Routine</h2>
            <div className="space-y-2">
              {['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Exfoliant', 'Mask'].map((product) => (
                <div className="flex items-center space-x-2" key={product}>
                  <Checkbox
                    id={product.toLowerCase()}
                    checked={userData.currentRoutine.includes(product.toLowerCase())}
                    onCheckedChange={() => handleMultiSelect('currentRoutine', product.toLowerCase())}
                  />
                  <Label htmlFor={product.toLowerCase()}>{product}</Label>
                </div>
              ))}
            </div>
          </motion.div>
        )
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Step 5: Additional Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Allergies or Sensitivities</Label>
                <Textarea
                  id="allergies"
                  placeholder="Enter any allergies or sensitivities"
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                <Select onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger id="budget">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget-friendly</SelectItem>
                    <SelectItem value="mid-range">Mid-range</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Preferred Brands</Label>
                <div className="space-y-2">
                  {['CeraVe', 'The Ordinary', 'Paula\'s Choice', 'Drunk Elephant', 'La Roche-Posay'].map((brand) => (
                    <div className="flex items-center space-x-2" key={brand}>
                      <Checkbox
                        id={brand.toLowerCase().replace(/\s+/g, '-')}
                        checked={userData.preferredBrands.includes(brand)}
                        onCheckedChange={() => handleMultiSelect('preferredBrands', brand)}
                      />
                      <Label htmlFor={brand.toLowerCase().replace(/\s+/g, '-')}>{brand}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <h2 className="text-2xl font-bold mb-4">Your Personalized Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.brand}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{product.description}</p>
                    <p className="mt-2"><strong>Key Ingredients:</strong> {product.keyIngredients.join(', ')}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">AI Skincare Recommendation Bot</h1>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        {step > 1 && step < 6 && (
          <Button onClick={handlePrevStep}>Previous</Button>
        )}
        {step < 5 && (
          <Button onClick={handleNextStep}>Next</Button>
        )}
        {step === 5 && (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendations'}
          </Button>
        )}
      </div>
    </div>
  )
}