'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simulated user data
const USER = {
  pin: '12345',
  balance: 100000, // 100,000 PKR
}

// Fast cash options (in PKR)
const FAST_CASH_OPTIONS = [1000, 2000, 5000, 10000, 20000, 25000]

// Simulated bill payees
const BILL_PAYEES = ['Electricity', 'Water', 'Internet', 'Phone']

export default function EnhancedATMSystem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pin, setPin] = useState('')
  const [balance, setBalance] = useState(USER.balance)
  const [currentScreen, setCurrentScreen] = useState<'main' | 'fastCash' | 'withdrawal' | 'deposit' | 'transfer' | 'balance' | 'billPayment'>('main')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [transferAccount, setTransferAccount] = useState('')
  const [selectedBillPayee, setSelectedBillPayee] = useState('')

  const handleLogin = () => {
    if (pin === USER.pin) {
      setIsLoggedIn(true)
      setPin('')
      setMessage('')
    } else {
      setMessage('Incorrect PIN. Please try again.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentScreen('main')
    setMessage('')
  }

  const handleTransaction = (type: 'withdraw' | 'deposit' | 'transfer' | 'billPayment', transactionAmount?: number) => {
    const parsedAmount = transactionAmount || parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage('Please enter a valid amount.')
      return
    }

    switch (type) {
      case 'withdraw':
        if (parsedAmount > balance) {
          setMessage('Insufficient funds.')
        } else {
          setBalance(balance - parsedAmount)
          setMessage(`Successfully withdrew ₨${parsedAmount.toLocaleString()}`)
        }
        break
      case 'deposit':
        setBalance(balance + parsedAmount)
        setMessage(`Successfully deposited ₨${parsedAmount.toLocaleString()}`)
        break
      case 'transfer':
        if (parsedAmount > balance) {
          setMessage('Insufficient funds for transfer.')
        } else if (!transferAccount) {
          setMessage('Please enter a valid account number.')
        } else {
          setBalance(balance - parsedAmount)
          setMessage(`Successfully transferred ₨${parsedAmount.toLocaleString()} to account ${transferAccount}`)
        }
        break
      case 'billPayment':
        if (parsedAmount > balance) {
          setMessage('Insufficient funds for bill payment.')
        } else if (!selectedBillPayee) {
          setMessage('Please select a bill payee.')
        } else {
          setBalance(balance - parsedAmount)
          setMessage(`Successfully paid ₨${parsedAmount.toLocaleString()} to ${selectedBillPayee}`)
        }
        break
    }

    setAmount('')
    setTransferAccount('')
    setSelectedBillPayee('')
  }

  const renderLoginScreen = () => (
    <CardContent className="p-6 space-y-4">
      <Input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="text-center text-2xl tracking-widest"
      />
      <Button onClick={handleLogin} className="w-full">Login</Button>
    </CardContent>
  )

  const renderMainScreen = () => (
    <CardContent className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => setCurrentScreen('fastCash')}>Fast Cash</Button>
        <Button onClick={() => setCurrentScreen('withdrawal')}>Cash Withdrawal</Button>
        <Button onClick={() => setCurrentScreen('deposit')}>Deposit</Button>
        <Button onClick={() => setCurrentScreen('transfer')}>Transfer</Button>
        <Button onClick={() => setCurrentScreen('balance')}>Check Balance</Button>
        <Button onClick={() => setCurrentScreen('billPayment')}>Pay Bills</Button>
        <Button onClick={handleLogout} variant="destructive" className="col-span-2">Logout</Button>
      </div>
    </CardContent>
  )

  const renderFastCashScreen = () => (
    <CardContent className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Fast Cash</h3>
      <div className="grid grid-cols-2 gap-4">
        {FAST_CASH_OPTIONS.map((amount) => (
          <Button key={amount} onClick={() => handleTransaction('withdraw', amount)}>₨{amount.toLocaleString()}</Button>
        ))}
      </div>
      <Button onClick={() => setCurrentScreen('main')} variant="outline">Back</Button>
    </CardContent>
  )

  const renderTransactionScreen = (title: string, type: 'withdraw' | 'deposit' | 'transfer' | 'billPayment') => (
    <CardContent className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="text-center text-2xl"
      />
      {type === 'transfer' && (
        <Input
          type="text"
          placeholder="Enter account number"
          value={transferAccount}
          onChange={(e) => setTransferAccount(e.target.value)}
          className="text-center"
        />
      )}
      {type === 'billPayment' && (
        <Select onValueChange={setSelectedBillPayee}>
          <SelectTrigger>
            <SelectValue placeholder="Select bill payee" />
          </SelectTrigger>
          <SelectContent>
            {BILL_PAYEES.map((payee) => (
              <SelectItem key={payee} value={payee}>{payee}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Button 
        onClick={() => handleTransaction(type)}
        disabled={!amount || isNaN(Number(amount))}
        className="w-full"
      >
        Confirm {title}
      </Button>
      <Button onClick={() => setCurrentScreen('main')} variant="outline">Back</Button>
    </CardContent>
  )

  const renderBalanceScreen = () => (
    <CardContent className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Current Balance</h3>
      <p className="text-2xl font-bold text-center">₨{balance.toLocaleString()}</p>
      <Button onClick={() => setCurrentScreen('main')} variant="outline">Back</Button>
    </CardContent>
  )

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <Card className="w-96 bg-white shadow-xl">
        <CardHeader className="bg-green-600 text-white">
          <CardTitle className="text-2xl font-bold">BANK AL-BADAR ATM</CardTitle>
          <CardDescription className="text-white-200 font-mono font-extralight">Your Complete Internet Banking Solution</CardDescription>
        </CardHeader>
        {isLoggedIn ? (
          <>
            {currentScreen === 'main' && renderMainScreen()}
            {currentScreen === 'fastCash' && renderFastCashScreen()}
            {currentScreen === 'withdrawal' && renderTransactionScreen('Cash Withdrawal', 'withdraw')}
            {currentScreen === 'deposit' && renderTransactionScreen('Deposit', 'deposit')}
            {currentScreen === 'transfer' && renderTransactionScreen('Transfer', 'transfer')}
            {currentScreen === 'billPayment' && renderTransactionScreen('Pay Bills', 'billPayment')}
            {currentScreen === 'balance' && renderBalanceScreen()}
          </>
        ) : (
          renderLoginScreen()
        )}
        <CardFooter className="bg-gray-100 text-center text-md font-bold text-gray-600">
          {message && (
            <p className={`w-full ${message.includes('Successfully') ? 'text-green-700' : 'text-red-700'}`}>
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>  
  )
}