import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, RotateCcw, Equal, Hash } from 'lucide-react';
import './Calculator.css';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [formula, setFormula] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    const handleNumber = (num) => {
        if (isFinished) {
            setDisplay(num);
            setIsFinished(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const handleOperator = (op) => {
        setFormula(display + ' ' + op + ' ');
        setDisplay('0');
        setIsFinished(false);
    };

    const calculate = () => {
        try {
            const fullFormula = formula + display;
            // Using Function constructor as a safer alternative to eval for simple math
            const result = new Function(`return ${fullFormula.replace(/×/g, '*').replace(/÷/g, '/')}`)();
            setDisplay(String(Number(result.toFixed(8))));
            setFormula('');
            setIsFinished(true);
        } catch (error) {
            setDisplay('Error');
            setFormula('');
        }
    };

    const clear = () => {
        setDisplay('0');
        setFormula('');
        setIsFinished(false);
    };

    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="calculator-card"
        >
            <div className="calc-header">
                <Hash className="calc-icon" size={20} />
                <span>Stellar Calculator</span>
            </div>

            <div className="calc-display-area">
                <div className="calc-formula">{formula}</div>
                <div className="calc-display">{display}</div>
            </div>

            <div className="calc-grid">
                <button onClick={clear} className="calc-btn btn-action">AC</button>
                <button onClick={backspace} className="calc-btn btn-action"><Delete size={20} /></button>
                <button onClick={() => handleOperator('/')} className="calc-btn btn-operator">÷</button>
                <button onClick={() => handleOperator('*')} className="calc-btn btn-operator">×</button>

                {[7, 8, 9].map(num => (
                    <button key={num} onClick={() => handleNumber(String(num))} className="calc-btn">{num}</button>
                ))}
                <button onClick={() => handleOperator('-')} className="calc-btn btn-operator">-</button>

                {[4, 5, 6].map(num => (
                    <button key={num} onClick={() => handleNumber(String(num))} className="calc-btn">{num}</button>
                ))}
                <button onClick={() => handleOperator('+')} className="calc-btn btn-operator">+</button>

                {[1, 2, 3].map(num => (
                    <button key={num} onClick={() => handleNumber(String(num))} className="calc-btn">{num}</button>
                ))}
                <button onClick={calculate} className="calc-btn btn-equal row-span-2">
                    <Equal size={24} />
                </button>

                <button onClick={() => handleNumber('0')} className="calc-btn col-span-2">0</button>
                <button onClick={() => handleNumber('.')} className="calc-btn">.</button>
            </div>
        </motion.div>
    );
};

export default Calculator;
