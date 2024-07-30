import Header from "./components/Header";
import Form from "./components/Form";
import Footer from "./components/Footer";
import BookForm from "./providers/BookForm";

export default function index() {

    return (
        <BookForm>
            <div className="grid gap-8">
                <Header />
                <Form />
                <Footer />
            </div>
        </BookForm>
    )
}
