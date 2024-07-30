import Header from "./components/Header";
import Form from "./components/Form";
import Footer from "./components/Footer";
import OrderForm from "./providers/OrderForm";

export default function index() {

    return (
        <OrderForm>
            <div className="grid gap-8">
                <Header />
                <Form />
                <Footer />
            </div>
        </OrderForm>
    )
}
