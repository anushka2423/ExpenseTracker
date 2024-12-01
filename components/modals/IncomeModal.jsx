import { useContext, useRef } from "react";

//components and functions
import { currencyFormatter } from "@/lib/utils";
import Modal from "@/components/Modal";

//icons 
import { FaRegTrashAlt } from 'react-icons/fa'
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";


export default function AddIncomeModal({show, onClose}) {
    const amountRef = useRef();
    const descriptionRef = useRef();
    const { incomeList, addIncomeItem, removeIncomeItem } = useContext(financeContext);
    const { user } = useContext(authContext);

    // handler function 
    async function addIncomeHandler (e) {
        e.preventDefault();
    
        const newIncome = {
          amount: amountRef.current.value,
          discription: descriptionRef.current.value,
          createdAt: new Date(),
          uid: user.uid
        }

        try {
            await addIncomeItem(newIncome);
            descriptionRef.current.value = "";
            amountRef.current.value = "";
            toast.success("Income Added Successfully");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
        
    }
    
    async function deleteIncomeEntryHandler(incomeId) {
        try {
            await removeIncomeItem(incomeId);
            toast.success("Income Deleted Successfully");
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    return (
        <Modal show={show} onClose={onClose}>
            <form className="input-group" onSubmit={addIncomeHandler}>
            <div className="input-group">
                <label htmlFor="amount">Income Amount</label>
                <input ref={amountRef} name="amount" type="number" min={0.01} step={0.01} placeholder="Enter Income Amount" required/>
            </div>
            <div className="input-group">
                <label htmlFor="description">Description</label>
                <input ref={descriptionRef} name="description" type="text" placeholder="Enter Description" required/>
            </div>

            <button type="submit" className="btn btn-primary">Add Entry</button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
            <h3 className="text-2xl font-bold">Income History</h3>

            {
                incomeList.map((income) => {
                return(
                    <div className="flex items-center justify-between" key={income.id}>
                    <div>
                        <p className="font-semibold">{income.discription}</p>
                        <small className="text-xs">{income.createdAt.toISOString()}</small>
                    </div>
                    <p className="flex items-center gap-2">
                        {currencyFormatter(income.amount)}
                        <button className="btn" onClick={() => deleteIncomeEntryHandler(income.id)}><FaRegTrashAlt /></button>
                    </p>
                    </div>
                )
                })
            }
            </div>
        </Modal>
    );
}