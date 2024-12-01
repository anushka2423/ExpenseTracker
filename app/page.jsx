"use client"

import { useContext, useEffect, useState } from "react";
import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import { currencyFormatter } from "@/lib/utils";

import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js"
import {Doughnut} from 'react-chartjs-2';
import AddIncomeModal from "@/components/modals/IncomeModal";
import { financeContext } from "@/lib/store/finance-context";
import AddExpensesModal from "@/components/modals/ExpensesModal";
import { authContext } from "@/lib/store/auth-context";
import SignIn from "@/components/SignIn";


ChartJS.register(ArcElement, Tooltip, Legend)

// const dummy_data = [
//   {
//     id:1,
//     title: "Love",
//     color: "#000",
//     amount: 500,
//   },
//   {
//     id:2,
//     title: "Me",
//     color: "#000",
//     amount: 500,
//   },
//   {
//     id:3,
//     title: "You",
//     color: "#000",
//     amount: 560,
//   },
//   {
//     id:4,
//     title: "I",
//     color: "#000",
//     amount: 300,
//   },
//   {
//     id:5,
//     title: "Heheheee",
//     color: "#000",
//     amount: 50,
//   }
// ]

export default function Home() {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [balance, setBalance] = useState(0);

  const { expensesList, incomeList } = useContext(financeContext);
  const { user, loading } = useContext(authContext);

  useEffect(() => {
    const newBalance =  incomeList.reduce((amount, i) => {
      // Convert to string, remove ₹ and commas, then parse to float
      const incomeValue = parseFloat(String(i.amount).replace(/[₹,]/g, "")) || 0;
      return amount + incomeValue;
    }, 0) - 
    expensesList.reduce((amount, e) => {
      // Convert to string, remove ₹ and commas, then parse to float
      const expenseAmount = parseFloat(String(e.amount).replace(/[₹,]/g, "")) || 0;
      return amount + expenseAmount;
    }, 0);

    setBalance(newBalance);
  }, [expensesList, incomeList]);

  if(!user) {
    return <SignIn/>
  }

  return (
    <>
    {/* Add income Modal */}
      <AddIncomeModal show={showIncomeModal} onClose={setShowIncomeModal}/>

    {/* Add Expenses Modal */}
      <AddExpensesModal show={showExpensesModal} onClose={setShowExpensesModal}/>

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{ currencyFormatter(balance) }</h2>
        </section>

        <section className="flex items-center gap-5 py-3">
          <button onClick={() => setShowExpensesModal(true)} className="btn btn-primary">+ Expenses</button>
          <button onClick={() => setShowIncomeModal(true)} className="btn btn-primary-outline">+ Income</button>
        </section>

        {/* Expenses */}
        <section className="py-6">
          <h3 className="text-2xl">My Expenses</h3>

          <div className="flex flex-col gap-4 mt-6">
            {
              expensesList.map((expense) => (
                <ExpenseCategoryItem
                  key={expense.id}
                  expense={expense}
                />
              ))
            }
          </div>
        </section>

        {/* chart section */}
        <section className="py-6">
          <a id="stats"/>
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut 
              data={ 
                {
                  labels: expensesList.map(expense => expense.title),
                  datasets: [
                    {
                      label: "Expense",
                      data: expensesList.map(expense => expense.amount),
                      backgroundColor: expensesList.map(expense => expense.color),
                      borderColor: ["#18181b"],
                      borderWidth: 5,
                    }
                  ]
                }
              }
            />

          </div>
        </section>
      </main>
    </>
  );
}

