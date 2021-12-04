import React ,{useState, useEffect} from 'react'
import {Paper, Stepper, Step,StepLabel, Typography, CircularProgress,Divider,Button,CssBaseline}from '@material-ui/core'

import {commerce} from'../../../lib/commerce';
import useStyles from'./styles'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { Link,useHistory } from 'react-router-dom';

const steps =['Shipping address','Payment details'];

const Checkout = ({cart, order,onCaptureCheckout,error}) => {
    
    const [activeStep, setActiveStep]=useState(0);
    const [checkoutToken, setcheckoutToken]= useState(null);
    const[shippingData, setShippingData]=useState({});
    const [isFinished, setIsFinished]= useState(false);
    const classes = useStyles();
    const history = useHistory();


    useEffect(() => {
        const generateToken = async ()=>{
            try {
                const token =await commerce.checkout.generateToken(cart.id,{type: 'cart'})
                 
                setcheckoutToken(token);
                
            } catch (error) {
                history.pushState('/')
            }
        }
        generateToken();
    },[cart]); 

    const nextStep =() => setActiveStep((prevActiveStep) => prevActiveStep +1);
    const backStep =() => setActiveStep((prevActiveStep) => prevActiveStep -1);
    
    const next = (data) => {
        setShippingData(data);

        nextStep();
    }
    const timeout =()=>{
        setTimeout(()=>{
            setIsFinished(true)
        },3000);
    }
    

    let Confirmation =()=> order.customer ?(
        <>
        <div>
            <Typography variant="h5">Thank You for your purchase, {order.customer.firstname} {order.customer.lastname} </Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>

        </div>
        <br/>
        <Button component={Link} to='/' variant="outlined" type='button'>Back to Home</Button>
                
        </>
    ):isFinished ?(
        <>
        <div>
            <Typography variant="h5">Thank You for your purchase</Typography>
            <Divider className={classes.divider} />
           
        </div>
        <br/>
        <Button component={Link} to='/' variant="outlined" type='button'>Back to Home</Button>
                
        </>
    ):(
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );
    if(error){
        <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} to='/' variant="outlined" type="button">Back to Home</Button>
        </>

    }

    
    const Form = () => activeStep ==0
    ? <AddressForm checkoutToken={checkoutToken} next={next} />
    : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backstep={backStep}onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>

        return (
        <>
        <CssBaseline />
        <div className={classes.toolbar}/>
            <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="centre">Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.Stepper}>
                    {steps.map((step)=>(
                        <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                        </Step>

                    ))}
                    </Stepper> 
                    {activeStep == steps.length ? <Confirmation />:<Form /> }     
                    </Paper>
            </main>
         </>
    )
}

export default Checkout
