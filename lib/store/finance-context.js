"use client"

import { createContext, useContext, useEffect, useState } from "react"

// firebase
import { db } from "@/lib/firebase";
import { collection, addDoc, getDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { authContext } from "./auth-context";

export const financeContext = createContext({
    expensesList: [],
    incomeList: [],
    addIncomeItem: async () => {},
    removeIncomeItem: async () => {},
    addExpenseItem: async () => {},
    addCategory: async () => {},
    deleteExpenseItem: async () => {},
    deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({children}) {
 
    const [incomeList, setIncomeList] = useState([]);
    const [expensesList, setExpensesList] = useState([]);
    const [isClient, setIsClient] = useState(false);

    const { user } = useContext(authContext);

    const addCategory = async (category) => {
      try {
          const collectionRef = collection(db, "expenses")
          const docSpan = await addDoc(collectionRef, {
              uid: user.uid,
              ...category,
              items: []
          });

          setExpensesList(prevExpenses => {
            return [
              ...prevExpenses,
              {
                id: docSpan.id,
                uid: user.uid,
                items: [],
                ...category
              }
            ]
          })
      } catch (error) {
          throw error
      }
  }

    const addExpenseItem = async (expenseCategoryId, newExpense) => {
      const docRef = doc(db, "expenses", expenseCategoryId);

      try {
        await updateDoc(docRef, {...newExpense});

        setExpensesList((prevState) => {
          const updatedExpenses = [...prevState]

          const foundIndex = updatedExpenses.findIndex(expense => {
            return expense.id === expenseCategoryId
          })

          updatedExpenses[foundIndex] = {id: expenseCategoryId, ...newExpense}

          return updatedExpenses;
        })
      } catch (error) {
        throw error
      }
    }

    const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
      try {
        const docRef = doc(db, "expenses", expenseCategoryId);

        await updateDoc (docRef, {
            ...updatedExpense,
        });
        
        setExpensesList((prevExpenses) => {
        
        const updatedExpenses = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId 
        );
        
        updatedExpenses[pos].items = [...updatedExpense.items];
        
        updatedExpenses[pos].amount = updatedExpense.total;
        
        return updatedExpenses; 
      });
      } catch (error) {
        console.log(error);
      }
    }

    const addIncomeItem = async (newIncome) => {
        const collectionRef = collection(db, "income");
        try {
          const docsSnap = await addDoc(collectionRef, newIncome);
    
          // update state
          setIncomeList(prev => {
            return [
              ...prev, 
              {
                id: docsSnap.id, 
                ...newIncome
              }
            ]
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
    };
    const removeIncomeItem = async (incomeId) => {
        const docRef = doc(db, 'income', incomeId);
        console.log(docRef);
        try {
          await deleteDoc(docRef);
          setIncomeList(prev => {
            return prev.filter(i => i.id !== incomeId);
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
    };

    const deleteExpenseCategory = async(expenseCategoryId) => {
      try {
        const docRef = doc(db, "expenses", expenseCategoryId);
        await deleteDoc(docRef);

        setExpensesList((prevExpenses) => {
          const updatedExpenses = prevExpenses.filter(
            (expense) => expense.id !== expenseCategoryId
          );

          return [...updatedExpenses];
        })
      } catch (error) {
        console.log(error);
      }
    }



    useEffect(() => {
      if(!user || !user.uid) return;
        const getIncomeData = async () => {
          const collectionRef = collection(db, 'income');
          const q = query(collectionRef, where("uid", "==", user.uid))
          const docsSnap = await getDocs(q);
    
          const data = docsSnap.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            };
          });
    
          setIncomeList(data);
        };

        const getExpenseData = async () => {
          const collectionRef = collection(db, 'expenses');
          const q = query(collectionRef, where("uid", "==", user.uid))
          const docsSnap = await getDocs(q);

          const data = docsSnap.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
              // createdAt: new Date(doc.data().createdAt.toMillis()),
            };
          });

          setExpensesList(data);
        }

        getExpenseData();
        getIncomeData();
    }, [user]);

    const value = {incomeList, expensesList, addIncomeItem, removeIncomeItem, addExpenseItem,deleteExpenseItem,deleteExpenseCategory, addCategory}

    return <financeContext.Provider value={value}>
        {children}
    </financeContext.Provider>
}